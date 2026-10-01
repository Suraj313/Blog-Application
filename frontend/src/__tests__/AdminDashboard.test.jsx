import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../pages/admin/AdminDashboard";
import * as adminDashboardApi from "../api/adminDashboardApi";

jest.mock("../api/adminDashboardApi");

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    Storage.prototype.getItem = jest.fn(() => "fakeToken");
  });

  test("renders loading state initially", () => {
    adminDashboardApi.getDashboardStats.mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminDashboard />);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  test("displays dashboard stats", async () => {
    adminDashboardApi.getDashboardStats.mockResolvedValue({
      data: {
        totalPosts: 10,
        publishedPosts: 7,
        draftPosts: 3,
        totalCategories: 5,
        totalComments: 20,
        pendingComments: 4,
      },
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  test("shows alert on error", async () => {
    adminDashboardApi.getDashboardStats.mockRejectedValue(
      new Error("API Error")
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to load dashboard stats"
      );
    });
  });
});
