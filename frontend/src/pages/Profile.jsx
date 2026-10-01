import { useEffect, useRef, useState } from "react";
import {
  getUserProfile,
  uploadProfileImage,
  removeProfileImage,
} from "../api/userApi";
import { API_BASE_URL } from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cached = localStorage.getItem("profile");
    if (cached) {
      setProfile(JSON.parse(cached));
    }

    getUserProfile(token).then((res) => {
      setProfile(res.data);
      localStorage.setItem("profile", JSON.stringify(res.data));
    });
  }, [token]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setLoading(true);
      const res = await uploadProfileImage(formData, token);

      const updatedProfile = {
        ...profile,
        profileImage: res.data.profileImage,
      };

      setProfile(updatedProfile);
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
    } catch {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Remove profile photo?")) return;

    try {
      setLoading(true);
      await removeProfileImage(token);

      const updatedProfile = { ...profile, profileImage: null };
      setProfile(updatedProfile);
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
    } catch {
      alert("Failed to remove image");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          My Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          {profile.profileImage ? (
            <img
              src={`${API_BASE_URL}${profile.profileImage}`}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover shadow-md mb-4"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center mb-4 text-gray-600">
              No Image
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {profile.profileImage ? (
            <button
              onClick={handleRemoveImage}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              {loading ? "Removing..." : "Remove Photo"}
            </button>
          ) : (
            <button
              onClick={handleUploadClick}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Uploading..." : "Upload Photo"}
            </button>
          )}
        </div>

        <div className="space-y-4 text-center">
          <p>
            <span className="text-gray-500">Username:</span>{" "}
            <strong>{profile.name}</strong>
          </p>

          <p>
            <span className="text-gray-500">Email:</span>{" "}
            <strong>{profile.email}</strong>
          </p>

          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
              Total Posts: {profile.totalPosts ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
