import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginModal from "../components/LoginModal";
import { MemoryRouter } from "react-router-dom";
import * as authApi from "../api/authApi";
import * as auth from "../utils/auth";

jest.mock("../api/authApi");
jest.mock("../utils/auth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginModal Component", () => {
  let modalRoot;

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    Storage.prototype.setItem = jest.fn();

    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    document.body.removeChild(modalRoot);
  });

  test("renders login modal", () => {
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    expect(screen.getByText(/login required/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test("closes modal on close button click", () => {
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    const closeBtn = screen.getByText("✕");
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  test("handles successful login for regular user", async () => {
    const onClose = jest.fn();
    authApi.loginUser.mockResolvedValue({ data: { token: "fakeToken" } });
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "user" });

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authApi.loginUser).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "123456",
      });
      expect(onClose).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/create-post");
    });
  });

  test("handles successful login for admin user", async () => {
    const onClose = jest.fn();
    authApi.loginUser.mockResolvedValue({ data: { token: "fakeToken" } });
    auth.getUserFromToken.mockReturnValue({ userId: "123", role: "admin" });

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/posts/new");
    });
  });

  test("shows error on login failure", async () => {
    const onClose = jest.fn();
    authApi.loginUser.mockRejectedValue(new Error("Login failed"));

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid email or password");
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  test("shows loading state during login", async () => {
    const onClose = jest.fn();
    authApi.loginUser.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <MemoryRouter>
        <LoginModal onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });


});
