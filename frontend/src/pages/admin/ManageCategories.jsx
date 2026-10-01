import { useEffect, useState } from "react";
import {
  getAllCategoriesAdmin,
  createCategoryAdmin,
  deleteCategoryAdmin,
} from "../../api/adminCategoryApi";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesAdmin();
      setCategories(res.data);
    } catch (error) {
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await createCategoryAdmin(name, token);
      setCategories([...categories, res.data.category || res.data]);
      setName("");
    } catch (error) {
      alert(error.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategoryAdmin(id, token);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading categories...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Manage Categories
      </h2>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Category
          </button>
        </form>
      </div>

      {categories.length === 0 && (
        <p className="text-gray-500">
          No categories found
        </p>
      )}

      {categories.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50"
              >
                <span className="text-gray-900 font-medium">
                  {cat.name}
                </span>

                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
