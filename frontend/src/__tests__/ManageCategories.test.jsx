import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ManageCategories from "../pages/admin/ManageCategories";
import * as adminCategoryApi from "../api/adminCategoryApi";

jest.mock("../api/adminCategoryApi");

describe("ManageCategories Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.confirm = jest.fn();
    Storage.prototype.getItem = jest.fn(() => "fakeToken");
  });

  test("renders loading state", () => {
    adminCategoryApi.getAllCategoriesAdmin.mockImplementation(
      () => new Promise(() => {})
    );

    render(<ManageCategories />);

    expect(screen.getByText(/loading categories/i)).toBeInTheDocument();
  });

  test("displays categories list", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [
        { _id: "1", name: "Tech" },
        { _id: "2", name: "News" },
      ],
    });

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
      expect(screen.getByText("News")).toBeInTheDocument();
    });
  });

  test("creates new category", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [{ _id: "1", name: "Tech" }],
    });

    adminCategoryApi.createCategoryAdmin.mockResolvedValue({
      data: { category: { _id: "2", name: "Sports" } },
    });

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/new category name/i);
    fireEvent.change(input, { target: { value: "Sports" } });
    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(adminCategoryApi.createCategoryAdmin).toHaveBeenCalledWith(
        "Sports",
        "fakeToken"
      );
    });
  });

  test("deletes category", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [
        { _id: "1", name: "Tech" },
        { _id: "2", name: "News" },
      ],
    });

    adminCategoryApi.deleteCategoryAdmin.mockResolvedValue({});
    window.confirm.mockReturnValue(true);

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(adminCategoryApi.deleteCategoryAdmin).toHaveBeenCalledWith(
        "1",
        "fakeToken"
      );
    });
  });

  test("cancels delete when user declines", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [{ _id: "1", name: "Tech" }],
    });

    window.confirm.mockReturnValue(false);

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(adminCategoryApi.deleteCategoryAdmin).not.toHaveBeenCalled();
  });

  test("shows no categories message", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [],
    });

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText(/no categories found/i)).toBeInTheDocument();
    });
  });

  test("handles create error", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [],
    });

    adminCategoryApi.createCategoryAdmin.mockRejectedValue({
      response: { data: { message: "Category already exists" } },
    });

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText(/manage categories/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/new category name/i);
    fireEvent.change(input, { target: { value: "Tech" } });
    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Category already exists");
    });
  });

  test("handles delete error", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockResolvedValue({
      data: [{ _id: "1", name: "Tech" }],
    });

    adminCategoryApi.deleteCategoryAdmin.mockRejectedValue(
      new Error("Delete failed")
    );
    window.confirm.mockReturnValue(true);

    render(<ManageCategories />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Delete failed");
    });
  });

  test("handles load error", async () => {
    adminCategoryApi.getAllCategoriesAdmin.mockRejectedValue(
      new Error("Load failed")
    );

    render(<ManageCategories />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to load categories");
    });
  });
});
