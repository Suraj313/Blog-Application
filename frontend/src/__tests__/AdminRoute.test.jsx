import { render, screen } from "@testing-library/react";
import AdminRoute from "../components/AdminRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import * as auth from "../utils/auth";

jest.mock("../utils/auth");

describe("AdminRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children for admin user", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "admin" });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/admin content/i)).toBeInTheDocument();
  });

  test("redirects to login when no user", () => {
    auth.getUserFromToken.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin Content</div>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/admin content/i)).not.toBeInTheDocument();
  });

  test("redirects to home for non-admin user", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin Content</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/home page/i)).toBeInTheDocument();
    expect(screen.queryByText(/admin content/i)).not.toBeInTheDocument();
  });
});
