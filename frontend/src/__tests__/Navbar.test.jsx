import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { MemoryRouter } from "react-router-dom";
import * as auth from "../utils/auth";

jest.mock("../utils/auth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.removeItem = jest.fn();
  });

  test("renders navbar with logo", () => {
    auth.getUserFromToken.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/devscribe/i)).toBeInTheDocument();
  });

  test("shows login and register links when not logged in", () => {
    auth.getUserFromToken.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  test("shows profile and logout when logged in", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  test("shows admin link for admin users", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "admin" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });

  test("handles logout", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows create post link for logged in users", () => {
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /create post/i })).toBeInTheDocument();
  });
});
