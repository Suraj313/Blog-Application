import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function UserCreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const validate = () => {
    const newErrors = {};

    if (title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (content.trim().length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("featuredImage", image);

    try {
      setLoading(true);
      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post submitted for admin approval");
      navigate("/");
    } catch {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Create New Post
        </h2>
        <p className="text-gray-500 mb-8">
          Your post will be reviewed by admin before publishing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title (min 10 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              rows="12"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Write your post content (min 50 characters)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between text-sm mt-1">
              {errors.content && (
                <p className="text-red-500">{errors.content}</p>
              )}
              <span className="text-gray-400">
                {content.length} characters
              </span>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Featured Image (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:bg-blue-50 file:text-blue-600
                hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserCreatePost;
