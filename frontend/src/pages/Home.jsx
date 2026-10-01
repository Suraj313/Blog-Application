import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import LoginModal from "../components/LoginModal";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showLogin, setShowLogin] = useState(false);

  const user = getUserFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    api
      .get("/posts", {
        params: {
          search,
          category,
          page,
          limit: 6,
        },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      });
  }, [search, category, page]);

  const handleStartWriting = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/posts/new");
    } else {
      navigate("/create-post");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-10 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          DevScribe
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-6">
          A modern blogging platform where users share ideas,
          knowledge, and real-world experiences.
        </p>

        <div className="flex gap-4">
          <a
            href="#posts"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Blogs
          </a>

          <button
            onClick={handleStartWriting}
            className="bg-black/20 border border-white px-6 py-3 rounded-lg font-semibold hover:bg-black/30 transition"
          >
            Start Writing
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2 id="posts" className="text-3xl font-bold mb-8">
        Latest Posts
      </h2>

      {posts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No posts found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            {post.featuredImage ? (
              <img
                src={`${API_BASE_URL}${post.featuredImage}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}

            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {post.content.substring(0, 120)}...
              </p>

              <Link
                to={`/post/${post._id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default Home;