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

describe("Auth Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("protect middleware", () => {
    test("should return 401 if no authorization header", async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized,no token" });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if authorization header does not start with Bearer", async () => {
      const req = { headers: { authorization: "Basic token123" } };
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
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized,token failed" });
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next if token is valid and user exists", async () => {
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
        select: jest.fn().mockResolvedValue({ _id: "123", name: "Test User" }),
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("validtoken", process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith("123");
      expect(req.user).toEqual({ _id: "123", name: "Test User" });
      expect(next).toHaveBeenCalled();
    });

    test("should handle user not found in database", async () => {
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
        select: jest.fn().mockResolvedValue(null),
      });

      await protect(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("protectOptional middleware", () => {
    test("should call next without setting user if no token", async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protectOptional(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should set user if valid token provided", async () => {
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
        select: jest.fn().mockResolvedValue({ _id: "123", name: "Test User" }),
      });

      await protectOptional(req, res, next);

      expect(req.user).toEqual({ _id: "123", name: "Test User" });
      expect(next).toHaveBeenCalled();
    });

    test("should set user to null if token is invalid", async () => {
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

      await protectOptional(req, res, next);

      expect(req.user).toBe(null);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should handle authorization header without Bearer prefix", async () => {
      const req = {
        headers: { authorization: "token123" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protectOptional(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    test("should set user to null if user not found in database", async () => {
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
        select: jest.fn().mockResolvedValue(null),
      });

      await protectOptional(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });
});
