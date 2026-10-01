import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/Post.model.js", () => ({
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const Post = (await import("../models/Post.model.js")).default;

const { createPost, deletePost, getAllPosts, getSinglePost, updatePost } = await import(
  "../controllers/post.controller.js"
);

describe("Post Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createPost - success (admin publishes post)", async () => {
    const req = {
      body: {
        title: "Test",
        content: "Test Content",
        category: "cat123",
      },
      user: { _id: "user123", role: "admin" },
      file: null,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Post.create.mockResolvedValue({ _id: "post123" });

    await createPost(req, res);

    expect(Post.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("deletePost - post not found", async () => {
    const req = {
      params: { id: "post123" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Post.findById.mockResolvedValue(null);

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createPost - missing fields", async () => {
    const req = {
      body: { title: "Test" },
      user: { _id: "user123", role: "user" },
      file: null,
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createPost - user creates draft", async () => {
    const req = {
      body: {
        title: "Test",
        content: "Content",
        category: "cat123",
      },
      user: { _id: "user123", role: "user" },
      file: { filename: "test.jpg" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.create.mockResolvedValue({ _id: "post123", status: "draft" });

    await createPost(req, res);

    expect(Post.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "draft" })
    );
  });

  test("getAllPosts - success with pagination", async () => {
    const req = { query: { page: "1", limit: "5" }, user: null };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.countDocuments.mockResolvedValue(10);
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([{ _id: "post1" }]),
            }),
          }),
        }),
      }),
    });

    await getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getAllPosts - with search and category", async () => {
    const req = {
      query: { search: "test", category: "cat1" },
      user: null,
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.countDocuments.mockResolvedValue(5);
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      }),
    });

    await getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getAllPosts - admin sees all posts", async () => {
    const req = { query: {}, user: { role: "admin" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.countDocuments.mockResolvedValue(15);
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      }),
    });

    await getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getSinglePost - success", async () => {
    const req = { params: { id: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findOne.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: "post1", title: "Test" }),
      }),
    });

    await getSinglePost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getSinglePost - not found", async () => {
    const req = { params: { id: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findOne.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    await getSinglePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updatePost - success", async () => {
    const req = {
      params: { id: "post1" },
      body: { title: "Updated", content: "New content" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockPost = {
      _id: "post1",
      title: "Old",
      content: "Old content",
      save: jest.fn().mockResolvedValue(true),
    };

    Post.findById.mockResolvedValue(mockPost);

    await updatePost(req, res);

    expect(mockPost.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updatePost - not found", async () => {
    const req = {
      params: { id: "post1" },
      body: { title: "Updated" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findById.mockResolvedValue(null);

    await updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deletePost - success", async () => {
    const req = { params: { id: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockPost = {
      _id: "post1",
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    Post.findById.mockResolvedValue(mockPost);

    await deletePost(req, res);

    expect(mockPost.deleteOne).toHaveBeenCalled();
  });

  test("createPost - database error", async () => {
    const req = {
      body: { title: "Test", content: "Content", category: "cat123" },
      user: { _id: "user123", role: "admin" },
      file: null,
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.create.mockRejectedValue(new Error("DB error"));

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getAllPosts - database error", async () => {
    const req = { query: {}, user: null };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.countDocuments.mockRejectedValue(new Error("DB error"));

    await getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getSinglePost - database error", async () => {
    const req = { params: { id: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findOne.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await getSinglePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("updatePost - database error", async () => {
    const req = {
      params: { id: "post1" },
      body: { title: "Updated" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findById.mockRejectedValue(new Error("DB error"));

    await updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("deletePost - database error", async () => {
    const req = { params: { id: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Post.findById.mockRejectedValue(new Error("DB error"));

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});