import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ManagePosts from "./pages/admin/ManagePosts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageComments from "./pages/admin/ManageComments";
import AdminCreatePost from "./pages/admin/CreatePost";
import UserCreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <UserCreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<ManagePosts />} />
          <Route path="posts/new" element={<AdminCreatePost />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="comments" element={<ManageComments />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
