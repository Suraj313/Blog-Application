import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const navItemClass = (path) =>
    `block px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <h3 className="text-2xl font-bold text-blue-400">
            Admin Panel
          </h3>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 text-sm font-medium">
          <Link to="/admin" className={navItemClass("/admin")}>
            Dashboard
          </Link>

          <Link
            to="/admin/posts"
            className={navItemClass("/admin/posts")}
          >
            Posts
          </Link>

          <Link
            to="/admin/categories"
            className={navItemClass("/admin/categories")}
          >
            Categories
          </Link>

          <Link
            to="/admin/comments"
            className={navItemClass("/admin/comments")}
          >
            Comments
          </Link>
        </nav>

        <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-400">
          © Blog Admin
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
