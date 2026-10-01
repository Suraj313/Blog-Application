import { useEffect, useState } from "react";
import {
  getAllPostsAdmin,
  deletePostAdmin,
  updatePostStatusAdmin,
} from "../../api/adminPostApi";
import { Link } from "react-router-dom";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const res = await getAllPostsAdmin(token);
      setPosts(res.data.posts || res.data);
    } catch (error) {
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePostAdmin(id, token);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleToggleStatus = async (post) => {
    const newStatus =
      post.status === "published" ? "draft" : "published";

    try {
      await updatePostStatusAdmin(post._id, newStatus, token);

      setPosts(
        posts.map((p) =>
          p._id === post._id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading posts...
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Manage Posts
        </h2>

        <Link
          to="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create New Post
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500">
          No posts found
        </p>
      )}

      {posts.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {post.title}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {post.category?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleToggleStatus(post)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        post.status === "published"
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {post.status === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagePosts;
