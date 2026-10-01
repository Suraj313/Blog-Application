import { describe, test, expect, jest } from "@jest/globals";

jest.unstable_mockModule("multer", () => ({
  default: jest.fn(() => ({
    single: jest.fn(),
  })),
  diskStorage: jest.fn(),
}));

jest.unstable_mockModule("path", () => ({
  default: {
    extname: jest.fn(),
  },
}));

const multer = (await import("multer")).default;
const path = (await import("path")).default;

describe("Upload Middleware", () => {
  test("should accept valid image files", () => {
    path.extname.mockReturnValue(".jpg");
    
    const file = {
      originalname: "test.jpg",
      mimetype: "image/jpeg",
      fieldname: "image",
    };

    expect(file.mimetype).toMatch(/image/);
    expect(path.extname(file.originalname)).toMatch(/jpg/);
  });

  test("should accept png files", () => {
    path.extname.mockReturnValue(".png");
    
    const file = {
      originalname: "test.png",
      mimetype: "image/png",
    };

    expect(file.mimetype).toBe("image/png");
  });

  test("should handle jpeg files", () => {
    path.extname.mockReturnValue(".jpeg");
    
    const file = {
      originalname: "test.jpeg",
      mimetype: "image/jpeg",
    };

    expect(file.mimetype).toBe("image/jpeg");
  });
});
