import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/User.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
  },
}));

const User = (await import("../models/User.model.js")).default;
const bcrypt = (await import("bcryptjs")).default;
const jwt = (await import("jsonwebtoken")).default;

const { registerUser, loginUser } = await import(
  "../controllers/auth.controller.js"
);

describe("Auth Controller ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registerUser - success", async () => {
    const req = {
      body: { name: "Suraj", email: "test@test.com", password: "123456" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.create.mockResolvedValue({ _id: "123" });

    await registerUser(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("loginUser - invalid credentials", async () => {
    const req = {
      body: { email: "test@test.com", password: "123456" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("registerUser - missing fields", async () => {
    const req = { body: { name: "Suraj" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("registerUser - user already exists", async () => {
    const req = {
      body: { name: "Suraj", email: "test@test.com", password: "123456" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue({ _id: "123" });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("loginUser - success", async () => {
    const req = {
      body: { email: "test@test.com", password: "123456" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue({
      _id: "123",
      password: "hashedPassword",
      role: "user",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "token123",
    });
  });

  test("loginUser - wrong password", async () => {
    const req = {
      body: { email: "test@test.com", password: "wrongpass" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue({
      _id: "123",
      password: "hashedPassword",
    });
    bcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("registerUser - database error", async () => {
    const req = {
      body: { name: "Suraj", email: "test@test.com", password: "123456" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockRejectedValue(new Error("DB error"));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("loginUser - database error", async () => {
    const req = {
      body: { email: "test@test.com", password: "123456" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockRejectedValue(new Error("DB error"));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

