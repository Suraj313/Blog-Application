import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let Post;
let User;
let Category;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  Post = (await import("../models/Post.model.js")).default;
  User = (await import("../models/User.model.js")).default;
  Category = (await import("../models/Category.model.js")).default;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Post Model", () => {
  test("should create post with required fields", async () => {
    const user = await User.create({
      name: "Author",
      email: "author@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Tech" });

    const postData = {
      title: "Test Post",
      content: "Test content",
      category: category._id,
      author: user._id,
    };

    const post = new Post(postData);
    const savedPost = await post.save();

    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe(postData.title);
    expect(savedPost.content).toBe(postData.content);
    expect(savedPost.status).toBe("draft");
  });

  test("should have default status as draft", async () => {
    const user = await User.create({
      name: "Author2",
      email: "author2@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "News" });

    const post = new Post({
      title: "Post 2",
      content: "Content 2",
      category: category._id,
      author: user._id,
    });

    expect(post.status).toBe("draft");
  });

  test("should allow published status", async () => {
    const user = await User.create({
      name: "Author3",
      email: "author3@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Sports" });

    const post = new Post({
      title: "Published Post",
      content: "Published content",
      category: category._id,
      author: user._id,
      status: "published",
    });

    const savedPost = await post.save();
    expect(savedPost.status).toBe("published");
  });

  test("should trim title", async () => {
    const user = await User.create({
      name: "Author4",
      email: "author4@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Business" });

    const post = new Post({
      title: "  Trimmed Title  ",
      content: "Content",
      category: category._id,
      author: user._id,
    });

    const savedPost = await post.save();
    expect(savedPost.title).toBe("Trimmed Title");
  });

  test("should have timestamps", async () => {
    const user = await User.create({
      name: "Author5",
      email: "author5@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Health" });

    const post = new Post({
      title: "Post with timestamps",
      content: "Content",
      category: category._id,
      author: user._id,
    });

    const savedPost = await post.save();
    expect(savedPost.createdAt).toBeDefined();
    expect(savedPost.updatedAt).toBeDefined();
  });

  test("should allow featuredImage", async () => {
    const user = await User.create({
      name: "Author6",
      email: "author6@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Travel" });

    const post = new Post({
      title: "Post with image",
      content: "Content",
      category: category._id,
      author: user._id,
      featuredImage: "/uploads/image.jpg",
    });

    const savedPost = await post.save();
    expect(savedPost.featuredImage).toBe("/uploads/image.jpg");
  });

  test("should require title", async () => {
    const user = await User.create({
      name: "Author7",
      email: "author7@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Food" });

    const post = new Post({
      content: "Content without title",
      category: category._id,
      author: user._id,
    });

    await expect(post.save()).rejects.toThrow();
  });

  test("should require content", async () => {
    const user = await User.create({
      name: "Author8",
      email: "author8@example.com",
      password: "pass",
    });

    const category = await Category.create({ name: "Music" });

    const post = new Post({
      title: "Title without content",
      category: category._id,
      author: user._id,
    });

    await expect(post.save()).rejects.toThrow();
  });
});
