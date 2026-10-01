import { describe, test, expect, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../models/User.model.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

const User = (await import("../models/User.model.js")).default;
const jwt = (await import("jsonwebtoken")).default;

const { protect, protectOptional } = await import("../middleware/auth.middleware.js");


describe("Protect Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 if no token", async () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token verification fails", async () => {
    const req = {
      headers: { authorization: "Bearer invalidtoken" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next if token is valid", async () => {
    const req = {
      headers: { authorization: "Bearer validtoken" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: "123" });

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "123", name: "Suraj" }),
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validtoken",
      process.env.JWT_SECRET
    );

    expect(next).toHaveBeenCalled();
  });

  test("protectOptional - should call next without token", async () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await protectOptional(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test("protectOptional - should set user if token is valid", async () => {
    const req = { headers: { authorization: "Bearer validtoken" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: "123" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "123", name: "Suraj" }),
    });

    await protectOptional(req, res, next);

    expect(req.user).toEqual({ _id: "123", name: "Suraj" });
    expect(next).toHaveBeenCalled();
  });

  test("protectOptional - should set user to null if token is invalid", async () => {
    const req = { headers: { authorization: "Bearer invalidtoken" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await protectOptional(req, res, next);

    expect(req.user).toBe(null);
    expect(next).toHaveBeenCalled();
  });

  test("protect - should return 401 if user not found", async () => {
    const req = { headers: { authorization: "Bearer validtoken" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: "123" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});