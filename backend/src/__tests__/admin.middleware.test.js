import { describe, test, expect, beforeEach, jest } from "@jest/globals";

const { isAdmin } = await import("../middleware/admin.middleware.js");

describe("Admin Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call next if user is admin", () => {
    const req = { user: { _id: "user1", role: "admin" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("should return 403 if user is not admin", () => {
    const req = { user: { _id: "user1", role: "user" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 if no user", () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
