import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import { MemoryRouter } from "react-router-dom";
import * as authApi from "../api/authApi";

jest.mock("../api/authApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("renders register form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a password/i)).toBeInTheDocument();
  });

  test("register success flow", async () => {
    authApi.registerUser.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: "Suraj" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(authApi.registerUser).toHaveBeenCalledWith({
        name: "Suraj",
        email: "test@test.com",
        password: "123456",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error on registration failure", async () => {
    authApi.registerUser.mockRejectedValue({
      response: { data: { message: "User already exists" } },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User already exists");
    });
  });

  test("renders login link", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });
});
