import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

function Navbar() {
  const user = getUserFromToken();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          DevScribe
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600"
            >
              Admin
            </Link>
          )}

          {user && (
            <Link
              to={
                user.role === "admin"
                  ? "/admin/posts/new"
                  : "/create-post"
              }
              className="text-gray-700 hover:text-blue-600"
            >
              Create Post
            </Link>
          )}

          {/* PROFILE */}
          {user && (
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600"
            >
              Profile
            </Link>
          )}

          {/* AUTH */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
