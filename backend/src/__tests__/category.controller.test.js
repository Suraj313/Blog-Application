import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/Category.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

const Category = (await import("../models/Category.model.js")).default;

const {
  createCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
} = await import("../controllers/category.controller.js");

describe("Category Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createCategory - success", async () => {
    const req = { body: { name: "Tech" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findOne.mockResolvedValue(null);
    Category.create.mockResolvedValue({ _id: "cat1" });

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("updateCategory - not found", async () => {
    const req = { params: { id: "cat1" }, body: { name: "New" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findById.mockResolvedValue(null);

    await updateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createCategory - already exists", async () => {
    const req = { body: { name: "Tech" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findOne.mockResolvedValue({ _id: "cat1" });

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createCategory - missing name", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getAllCategories - success", async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Category.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: "cat1", name: "Tech" }]),
    });

    await getAllCategories(req, res);

    expect(res.json).toHaveBeenCalledWith([{ _id: "cat1", name: "Tech" }]);
  });

  test("updateCategory - success", async () => {
    const req = { params: { id: "cat1" }, body: { name: "Updated" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockCategory = {
      _id: "cat1",
      name: "Old",
      save: jest.fn().mockResolvedValue(true),
    };

    Category.findById.mockResolvedValue(mockCategory);

    await updateCategory(req, res);

    expect(mockCategory.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("deleteCategory - success", async () => {
    const req = { params: { id: "cat1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockCategory = {
      _id: "cat1",
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    Category.findById.mockResolvedValue(mockCategory);

    await deleteCategory(req, res);

    expect(mockCategory.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Category deleted" });
  });

  test("deleteCategory - not found", async () => {
    const req = { params: { id: "cat1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findById.mockResolvedValue(null);

    await deleteCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createCategory - database error", async () => {
    const req = { body: { name: "Tech" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findOne.mockRejectedValue(new Error("DB error"));

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getAllCategories - database error", async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Category.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("updateCategory - database error", async () => {
    const req = { params: { id: "cat1" }, body: { name: "Updated" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findById.mockRejectedValue(new Error("DB error"));

    await updateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("deleteCategory - database error", async () => {
    const req = { params: { id: "cat1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Category.findById.mockRejectedValue(new Error("DB error"));

    await deleteCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});