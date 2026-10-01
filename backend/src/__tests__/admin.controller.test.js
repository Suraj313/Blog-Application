import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/Post.model.js", () => ({
  default: {
    countDocuments: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Category.model.js", () => ({
  default: {
    countDocuments: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Comment.model.js", () => ({
  default: {
    countDocuments: jest.fn(),
  },
}));

const Post = (await import("../models/Post.model.js")).default;
const Category = (await import("../models/Category.model.js")).default;
const Comment = (await import("../models/Comment.model.js")).default;

const { getDashboardStats } = await import(
  "../controllers/admin.controller.js"
);

describe("Admin Controller ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getDashboardStats - success", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Post.countDocuments
      .mockResolvedValueOnce(10) 
      .mockResolvedValueOnce(7)  
      .mockResolvedValueOnce(3); 

    Category.countDocuments.mockResolvedValue(5);

    Comment.countDocuments
      .mockResolvedValueOnce(20) 
      .mockResolvedValueOnce(4); 

    await getDashboardStats(req, res);

    expect(res.json).toHaveBeenCalledWith({
      totalPosts: 10,
      publishedPosts: 7,
      draftPosts: 3,
      totalCategories: 5,
      totalComments: 20,
      pendingComments: 4,
    });
  });

  test("getDashboardStats - database error", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Post.countDocuments.mockRejectedValue(new Error("DB error"));

    await getDashboardStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});