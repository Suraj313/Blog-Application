import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let User;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  User = (await import("../models/User.model.js")).default;
  await User.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model", () => {
  test("should create user with required fields", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe("user");
    expect(savedUser.profileImage).toBe(null);
  });

  test("should have default role as user", async () => {
    const user = new User({
      name: "User2",
      email: "user2@example.com",
      password: "pass",
    });

    expect(user.role).toBe("user");
  });

  test("should allow admin role", async () => {
    const user = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "pass",
      role: "admin",
    });

    const savedUser = await user.save();
    expect(savedUser.role).toBe("admin");
  });

  test("should have timestamps", async () => {
    const user = new User({
      name: "User3",
      email: "user3@example.com",
      password: "pass",
    });

    const savedUser = await user.save();
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  test("should enforce unique email", async () => {
    const user1 = new User({
      name: "User4",
      email: "duplicate@example.com",
      password: "pass",
    });
    await user1.save();

    const user2 = new User({
      name: "User5",
      email: "duplicate@example.com",
      password: "pass",
    });

    await expect(user2.save()).rejects.toThrow();
  });

  test("should allow profileImage to be set", async () => {
    const user = new User({
      name: "User6",
      email: "user6@example.com",
      password: "pass",
      profileImage: "/uploads/profile.jpg",
    });

    const savedUser = await user.save();
    expect(savedUser.profileImage).toBe("/uploads/profile.jpg");
  });
});
