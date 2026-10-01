import * as authApi from "../api/authApi";
import * as userApi from "../api/userApi";
import api from "../api/axios";

jest.mock("../api/axios");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loginUser calls api with correct data", async () => {
    const mockData = { email: "test@test.com", password: "123456" };
    api.post.mockResolvedValue({ data: { token: "fakeToken" } });

    await authApi.loginUser(mockData);

    expect(api.post).toHaveBeenCalledWith("/auth/login", mockData);
  });

  test("registerUser calls api with correct data", async () => {
    const mockData = {
      name: "Test",
      email: "test@test.com",
      password: "123456",
    };
    api.post.mockResolvedValue({ data: {} });

    await authApi.registerUser(mockData);

    expect(api.post).toHaveBeenCalledWith("/auth/register", mockData);
  });
});

describe("User API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getUserProfile calls api with token", async () => {
    const token = "fakeToken";
    api.get.mockResolvedValue({ data: { name: "Test" } });

    await userApi.getUserProfile(token);

    expect(api.get).toHaveBeenCalledWith("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  test("uploadProfileImage calls api with formData and token", async () => {
    const token = "fakeToken";
    const formData = new FormData();
    api.put.mockResolvedValue({ data: { profileImage: "/uploads/test.jpg" } });

    await userApi.uploadProfileImage(formData, token);

    expect(api.put).toHaveBeenCalledWith("/users/profile/image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  });

  test("removeProfileImage calls api with token", async () => {
    const token = "fakeToken";
    api.delete.mockResolvedValue({ data: {} });

    await userApi.removeProfileImage(token);

    expect(api.delete).toHaveBeenCalledWith("/users/profile/image", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });
});
