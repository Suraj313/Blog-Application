import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const isCloudinaryConfigured = () => {
  return (
    !!process.env.CLOUDINARY_URL ||
    (!!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET)
  );
};

if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpg, jpeg, png)"));
  }
};

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

const getMulterStorage = () => {
  if (isCloudinaryConfigured()) {
    return multer.memoryStorage();
  }
  return diskStorage;
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "blog_app",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const multerInstance = multer({
  storage: getMulterStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const upload = {
  single(fieldName) {
    return (req, res, next) => {
      // Refresh storage mode in case env changed at runtime
      const currentMulter = multer({
        storage: getMulterStorage(),
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
      });

      currentMulter.single(fieldName)(req, res, async (err) => {
        if (err) return next(err);

        if (req.file && req.file.buffer && isCloudinaryConfigured()) {
          try {
            const result = await uploadToCloudinary(req.file.buffer);
            req.file.path = result.secure_url;
            req.file.secure_url = result.secure_url;
            req.file.filename = result.public_id;
            next();
          } catch (uploadError) {
            next(uploadError);
          }
        } else {
          next();
        }
      });
    };
  },
};

export default upload;
