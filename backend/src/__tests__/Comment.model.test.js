import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let Comment;
let User;
let Post;
let Category;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  Comment = (await import("../models/Comment.model.js")).default;
  User = (await import("../models/User.model.js")).default;
  Post = (await import("../models/Post.model.js")).default;
  Category = (await import("../models/Category.model.js")).default;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Comment Model", () => {
  test("should create comment with required fields", async () => {
    const user = await User.create({
      name: "Commenter",
      email: "commenter@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Tech" });

    const post = await Post.create({
      title: "Post",
      content: "Content",
      category: category._id,
      author: user._id,
    });

    const commentData = {
      post: post._id,
      user: user._id,
      text: "Great post!",
    };

    const comment = new Comment(commentData);
    const savedComment = await comment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.text).toBe(commentData.text);
    expect(savedComment.isApproved).toBe(false);
  });

  test("should have default isApproved as false", async () => {
    const user = await User.create({
      name: "User2",
      email: "user2@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "News" });

    const post = await Post.create({
      title: "Post2",
      content: "Content2",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      user: user._id,
      text: "Comment",
    });

    expect(comment.isApproved).toBe(false);
  });

  test("should allow isApproved to be true", async () => {
    const user = await User.create({
      name: "User3",
      email: "user3@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Sports" });

    const post = await Post.create({
      title: "Post3",
      content: "Content3",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      user: user._id,
      text: "Approved comment",
      isApproved: true,
    });

    const savedComment = await comment.save();
    expect(savedComment.isApproved).toBe(true);
  });

  test("should trim comment text", async () => {
    const user = await User.create({
      name: "User4",
      email: "user4@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Business" });

    const post = await Post.create({
      title: "Post4",
      content: "Content4",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      user: user._id,
      text: "  Trimmed text  ",
    });

    const savedComment = await comment.save();
    expect(savedComment.text).toBe("Trimmed text");
  });

  test("should have timestamps", async () => {
    const user = await User.create({
      name: "User5",
      email: "user5@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Health" });

    const post = await Post.create({
      title: "Post5",
      content: "Content5",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      user: user._id,
      text: "Comment with timestamps",
    });

    const savedComment = await comment.save();
    expect(savedComment.createdAt).toBeDefined();
    expect(savedComment.updatedAt).toBeDefined();
  });

  test("should require post reference", async () => {
    const user = await User.create({
      name: "User6",
      email: "user6@example.com",
      password: "pass",
    });

    const comment = new Comment({
      user: user._id,
      text: "Comment without post",
    });

    await expect(comment.save()).rejects.toThrow();
  });

  test("should require user reference", async () => {
    const user = await User.create({
      name: "User7",
      email: "user7@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Travel" });

    const post = await Post.create({
      title: "Post7",
      content: "Content7",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      text: "Comment without user",
    });

    await expect(comment.save()).rejects.toThrow();
  });

  test("should require text", async () => {
    const user = await User.create({
      name: "User8",
      email: "user8@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Food" });

    const post = await Post.create({
      title: "Post8",
      content: "Content8",
      category: category._id,
      author: user._id,
    });

    const comment = new Comment({
      post: post._id,
      user: user._id,
    });

    await expect(comment.save()).rejects.toThrow();
  });
});
