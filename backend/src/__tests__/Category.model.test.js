import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let Category;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  Category = (await import("../models/Category.model.js")).default;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Category Model", () => {
  test("should create category with name", async () => {
    const categoryData = { name: "Technology" };
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(categoryData.name);
  });

  test("should trim category name", async () => {
    const category = new Category({ name: "  Sports  " });
    const savedCategory = await category.save();

    expect(savedCategory.name).toBe("Sports");
  });

  test("should have timestamps", async () => {
    const category = new Category({ name: "News" });
    const savedCategory = await category.save();

    expect(savedCategory.createdAt).toBeDefined();
    expect(savedCategory.updatedAt).toBeDefined();
  });

  test("should enforce unique category name", async () => {
    const category1 = new Category({ name: "Business" });
    await category1.save();

    const category2 = new Category({ name: "Business" });
    await expect(category2.save()).rejects.toThrow();
  });

  test("should require name field", async () => {
    const category = new Category({});
    await expect(category.save()).rejects.toThrow();
  });
});
