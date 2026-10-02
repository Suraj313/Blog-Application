import Post from "../models/Post.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const featuredImage = req.file
      ? (req.file.path && (req.file.path.startsWith("http://") || req.file.path.startsWith("https://"))
          ? req.file.path
          : req.file.secure_url || `/uploads/${req.file.filename}`)
      : null;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
      status: req.user.role === "admin" ? "published" : "draft",
      featuredImage,
    });


    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { search, category } = req.query;

    let query = { status: "published" };

   
    if (req.user && req.user.role === "admin") {
      query = {};
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("author", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      _id: id,
      status: "published",
    })
      .populate("author", "name email")
      .populate("category", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.status = status || post.status;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 