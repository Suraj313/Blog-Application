import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/User.model.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Post.model.js", () => ({
  default: {
    countDocuments: jest.fn(),
  },
}));

jest.unstable_mockModule("fs", () => ({
  default: {
    existsSync: jest.fn(),
    unlinkSync: jest.fn(),
  },
}));

jest.unstable_mockModule("path", () => ({
  default: {
    join: jest.fn(),
  },
}));

const User = (await import("../models/User.model.js")).default;
const Post = (await import("../models/Post.model.js")).default;
const fs = (await import("fs")).default;
const path = (await import("path")).default;

const {
  getUserProfile,
  uploadProfileImage,
  removeProfileImage,
} = await import("../controllers/user.controller.js");

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getUserProfile - success", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user1",
        name: "Suraj",
        email: "test@test.com",
        role: "user",
      }),
    });

    Post.countDocuments.mockResolvedValue(3);

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("uploadProfileImage - no file", async () => {
    const req = { file: null, user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getUserProfile - user not found", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("uploadProfileImage - success", async () => {
    const req = {
      file: { filename: "profile.jpg" },
      user: { _id: "user1" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = {
      _id: "user1",
      profileImage: null,
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);

    await uploadProfileImage(req, res);

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("uploadProfileImage - replaces old image", async () => {
    const req = {
      file: { filename: "new.jpg" },
      user: { _id: "user1" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = {
      _id: "user1",
      profileImage: "/uploads/old.jpg",
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);
    path.join.mockReturnValue("uploads/old.jpg");
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockReturnValue(true);

    await uploadProfileImage(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
  });

  test("uploadProfileImage - user not found", async () => {
    const req = {
      file: { filename: "profile.jpg" },
      user: { _id: "user1" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockResolvedValue(null);

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("removeProfileImage - success", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = {
      _id: "user1",
      profileImage: "/uploads/profile.jpg",
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);
    path.join.mockReturnValue("uploads/profile.jpg");
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockReturnValue(true);

    await removeProfileImage(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(mockUser.profileImage).toBe(null);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("removeProfileImage - no image to remove", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = {
      _id: "user1",
      profileImage: null,
    };

    User.findById.mockResolvedValue(mockUser);

    await removeProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("removeProfileImage - user not found", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockResolvedValue(null);

    await removeProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getUserProfile - database error", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("uploadProfileImage - database error", async () => {
    const req = {
      file: { filename: "profile.jpg" },
      user: { _id: "user1" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockRejectedValue(new Error("DB error"));

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("removeProfileImage - database error", async () => {
    const req = { user: { _id: "user1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findById.mockRejectedValue(new Error("DB error"));

    await removeProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});