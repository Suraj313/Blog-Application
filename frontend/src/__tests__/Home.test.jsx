import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";
import api from "../api/axios";

jest.mock("../api/axios");
jest.mock("../utils/auth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === "/categories") {
        return Promise.resolve({
          data: [
            { _id: "1", name: "Tech" },
            { _id: "2", name: "News" },
          ],
        });
      }
      if (url === "/posts") {
        return Promise.resolve({
          data: {
            posts: [
              {
                _id: "post1",
                title: "Test Post",
                content: "Test content",
                featuredImage: null,
              },
            ],
            totalPages: 1,
          },
        });
      }
    });
  });

  test("renders home page", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/devscribe/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/test post/i)).toBeInTheDocument();
    });
  });

  test("loads categories and posts", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/categories");
      expect(api.get).toHaveBeenCalledWith("/posts", expect.any(Object));
    });
  });

  test("handles search input", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search posts/i);
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(searchInput.value).toBe("test");
  });

  test("handles category filter", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/all categories/i)).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    expect(select.value).toBe("1");
  });

  test("handles pagination", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/categories") {
        return Promise.resolve({ data: [] });
      }
      if (url === "/posts") {
        return Promise.resolve({
          data: {
            posts: [],
            totalPages: 3,
          },
        });
      }
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
    });
  });

  test("shows no posts message when empty", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/categories") {
        return Promise.resolve({ data: [] });
      }
      if (url === "/posts") {
        return Promise.resolve({
          data: { posts: [], totalPages: 0 },
        });
      }
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    });
  });

  test("handles start writing for logged in user", async () => {
    const { getUserFromToken } = require("../utils/auth");
    getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/devscribe/i)).toBeInTheDocument();
    });

    const startBtn = screen.getByRole("button", { name: /start writing/i });
    fireEvent.click(startBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/create-post");
  });

  test("handles start writing for admin", async () => {
    const { getUserFromToken } = require("../utils/auth");
    getUserFromToken.mockReturnValue({ userId: "123", role: "admin" });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/devscribe/i)).toBeInTheDocument();
    });

    const startBtn = screen.getByRole("button", { name: /start writing/i });
    fireEvent.click(startBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/posts/new");
  });
});
