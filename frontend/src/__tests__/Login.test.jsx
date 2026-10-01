import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { MemoryRouter } from "react-router-dom";
import * as authApi from "../api/authApi";

jest.mock("../api/authApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates input fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("123456");
  });

  test("calls loginUser and stores token on success", async () => {
    authApi.loginUser.mockResolvedValue({ data: { token: "fakeToken" } });
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authApi.loginUser).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "123456",
      });
      expect(setItemSpy).toHaveBeenCalledWith("token", "fakeToken");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows error on login failure", async () => {
    authApi.loginUser.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("renders register link", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole("link", { name: /register/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/register");
  });
});
