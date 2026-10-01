import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../components/ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children when token exists", () => {
    Storage.prototype.getItem = jest.fn(() => "fakeToken");

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test("redirects to login when no token", () => {
    Storage.prototype.getItem = jest.fn(() => null);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
