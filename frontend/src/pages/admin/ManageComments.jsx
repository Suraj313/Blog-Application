import { useEffect, useState } from "react";
import {
  getAllCommentsAdmin,
  approveCommentAdmin,
  deleteCommentAdmin,
} from "../../api/adminCommentApi";

function ManageComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      const res = await getAllCommentsAdmin(token);
      setComments(res.data);
    } catch (error) {
      alert("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveCommentAdmin(id, token);
      setComments(
        comments.map((c) =>
          c._id === id ? { ...c, isApproved: true } : c
        )
      );
    } catch (error) {
      alert("Approve failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteCommentAdmin(id, token);
      setComments(comments.filter((c) => c._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading comments...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Manage Comments
      </h2>

      {comments.length === 0 && (
        <p className="text-gray-500">
          No comments found
        </p>
      )}

      {comments.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Post
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Comment
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {comments.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.user?.name || "User"}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {c.post?.title || "Post"}
                  </td>

                  <td className="px-4 py-3 text-gray-700 max-w-md">
                    {c.text}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    {!c.isApproved && (
                      <button
                        onClick={() => handleApprove(c._id)}
                        className="px-3 py-1 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(c._id)}
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

export default ManageComments;
