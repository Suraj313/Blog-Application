import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/Comment.model.js", () => ({
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

const Comment = (await import("../models/Comment.model.js")).default;

const {
  addComment,
  approveComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
} = await import("../controllers/comment.controller.js");

describe("Comment Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addComment - success", async () => {
    const req = {
      body: { postId: "post1", text: "Nice" },
      user: { _id: "user1" },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.create.mockResolvedValue({ _id: "comment1" });

    await addComment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  })

  test("approveComment - not found", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.findById.mockResolvedValue(null);

    await approveComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("addComment - missing fields", async () => {
    const req = { body: {}, user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await addComment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("approveComment - success", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockComment = {
      _id: "comment1",
      isApproved: false,
      save: jest.fn().mockResolvedValue(true),
    };

    Comment.findById.mockResolvedValue(mockComment);

    await approveComment(req, res);

    expect(mockComment.save).toHaveBeenCalled();
    expect(mockComment.isApproved).toBe(true);
  });

  test("getCommentsByPost - success", async () => {
    const req = { params: { postId: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ _id: "comment1", text: "Nice" }]),
      }),
    });

    await getCommentsByPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deleteComment - success", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockComment = {
      _id: "comment1",
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    Comment.findById.mockResolvedValue(mockComment);

    await deleteComment(req, res);

    expect(mockComment.deleteOne).toHaveBeenCalled();
  });

  test("deleteComment - not found", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.findById.mockResolvedValue(null);

    await deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getAllComments - success", async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Comment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ _id: "comment1" }]),
        }),
      }),
    });

    await getAllComments(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  test("addComment - database error", async () => {
    const req = {
      body: { postId: "post1", text: "Nice" },
      user: { _id: "user1" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.create.mockRejectedValue(new Error("DB error"));

    await addComment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getCommentsByPost - database error", async () => {
    const req = { params: { postId: "post1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await getCommentsByPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("approveComment - database error", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.findById.mockRejectedValue(new Error("DB error"));

    await approveComment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("deleteComment - database error", async () => {
    const req = { params: { id: "comment1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Comment.findById.mockRejectedValue(new Error("DB error"));

    await deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getAllComments - database error", async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Comment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error("DB error")),
        }),
      }),
    });

    await getAllComments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});