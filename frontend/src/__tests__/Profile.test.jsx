import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Profile from "../pages/Profile";
import * as userApi from "../api/userApi";

jest.mock("../api/userApi");

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.confirm = jest.fn();
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fakeToken";
      return null;
    });
    Storage.prototype.setItem = jest.fn();
  });

  test("loads and displays user profile", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "Suraj",
        email: "test@test.com",
        profileImage: null,
        totalPosts: 5,
      },
    });

    render(<Profile />);

    await waitFor(() =>
      expect(screen.getByText(/suraj/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/total posts: 5/i)).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    userApi.getUserProfile.mockImplementation(
      () => new Promise(() => {})
    );

    render(<Profile />);

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test("displays profile image when available", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "Test",
        email: "test@test.com",
        profileImage: "/uploads/profile.jpg",
        totalPosts: 3,
      },
    });

    render(<Profile />);

    await waitFor(() => {
      const img = screen.getByAltText(/profile/i);
      expect(img).toBeInTheDocument();
    });
  });

  test("handles image upload", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "TestUser",
        email: "testuser@test.com",
        profileImage: null,
        totalPosts: 0,
      },
    });

    userApi.uploadProfileImage.mockResolvedValue({
      data: { profileImage: "/uploads/new.jpg" },
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/username/i)).toBeInTheDocument();
    });

    const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(userApi.uploadProfileImage).toHaveBeenCalled();
    });
  });

  test("handles image upload failure", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "TestUser",
        email: "testuser@test.com",
        profileImage: null,
        totalPosts: 0,
      },
    });

    userApi.uploadProfileImage.mockRejectedValue(new Error("Upload failed"));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/username/i)).toBeInTheDocument();
    });

    const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Image upload failed");
    });
  });

  test("handles image removal", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "UserWithImage",
        email: "user@test.com",
        profileImage: "/uploads/profile.jpg",
        totalPosts: 0,
      },
    });

    userApi.removeProfileImage.mockResolvedValue({});
    window.confirm.mockReturnValue(true);

    render(<Profile />);

    await waitFor(() => {
      const removeBtn = screen.getByRole("button", { name: /remove photo/i });
      expect(removeBtn).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", { name: /remove photo/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(userApi.removeProfileImage).toHaveBeenCalled();
    });
  });

  test("handles image removal failure", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "UserWithImage",
        email: "user@test.com",
        profileImage: "/uploads/profile.jpg",
        totalPosts: 0,
      },
    });

    userApi.removeProfileImage.mockRejectedValue(new Error("Remove failed"));
    window.confirm.mockReturnValue(true);

    render(<Profile />);

    await waitFor(() => {
      const removeBtn = screen.getByRole("button", { name: /remove photo/i });
      expect(removeBtn).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", { name: /remove photo/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to remove image");
    });
  });

  test("cancels image removal when user declines", async () => {
    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "AnotherUser",
        email: "another@test.com",
        profileImage: "/uploads/profile.jpg",
        totalPosts: 0,
      },
    });

    window.confirm.mockReturnValue(false);

    render(<Profile />);

    await waitFor(() => {
      const removeBtn = screen.getByRole("button", { name: /remove photo/i });
      fireEvent.click(removeBtn);
    });

    expect(userApi.removeProfileImage).not.toHaveBeenCalled();
  });

  test("uses cached profile data", async () => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fakeToken";
      return null;
    });

    userApi.getUserProfile.mockResolvedValue({
      data: {
        name: "TestUser",
        email: "test@test.com",
        profileImage: null,
        totalPosts: 3,
      },
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });
  });
});
