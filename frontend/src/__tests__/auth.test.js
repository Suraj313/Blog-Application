import { getUserFromToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode");

describe("Auth Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
  });

  test("returns null when no token", () => {
    Storage.prototype.getItem.mockReturnValue(null);

    const result = getUserFromToken();

    expect(result).toBeNull();
  });

  test("returns decoded user when token is valid", () => {
    Storage.prototype.getItem.mockReturnValue("validToken");
    jwtDecode.mockReturnValue({ userId: "123", role: "user" });

    const result = getUserFromToken();

    expect(result).toEqual({ userId: "123", role: "user" });
    expect(jwtDecode).toHaveBeenCalledWith("validToken");
  });

  test("returns null when token decode fails", () => {
    Storage.prototype.getItem.mockReturnValue("invalidToken");
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = getUserFromToken();

    expect(result).toBeNull();
  });
});
