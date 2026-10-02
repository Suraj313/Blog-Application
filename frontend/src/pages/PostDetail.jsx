import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../api/axios";
import { getCommentsByPost, addComment } from "../api/commentApi";

function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.get(`/posts/${id}`);
        const commentRes = await getCommentsByPost(id);

        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({ postId: id, text: commentText }, token);
      setCommentText("");
      alert("Comment submitted for admin approval");
    } catch (error) {
      alert("Login required to comment");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading...
      </p>
    );

  if (!post)
    return (
      <p className="text-center text-red-500 mt-10">
        Post not found
      </p>
    );

  return (
    <div className="bg-gray-100 py-10">
      <article className="max-w-3xl mx-auto bg-white rounded-lg shadow px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          By <span className="font-medium">{post.author?.name}</span> ·{" "}
          <span className="uppercase">{post.category?.name}</span>
        </p>

        {post.featuredImage && (
          <div className="w-full h-[360px] mb-8 overflow-hidden rounded-lg">
            <img
              src={
                post.featuredImage.startsWith("http")
                  ? post.featuredImage
                  : `${API_BASE_URL}${post.featuredImage}`
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow px-6 py-6 mt-10">
        <h3 className="text-2xl font-semibold mb-4">
          Comments
        </h3>

        {comments.length === 0 && (
          <p className="text-gray-500">
            No comments yet
          </p>
        )}

        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="border-b pb-3">
              <p className="font-medium text-gray-900">
                {c.user?.name}
              </p>
              <p className="text-gray-700">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {token ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Comment
              </button>
            </form>
          ) : (
            <p className="text-gray-500">
              Login to add a comment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
