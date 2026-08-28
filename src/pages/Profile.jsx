import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAvatar } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await updateAvatar(formData);

      const updatedUser = res.data.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSelectedFile(null);
      setMessage("Avatar updated successfully ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          My Profile
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={preview || "https://placehold.co/200x200"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow"
          />

          {/* Select Image */}
          <label className="mt-5 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Upload */}
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Uploading..." : "Upload Avatar"}
            </button>
          )}

          {/* Success */}
          {message && (
            <p className="mt-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              {message}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* User Information */}
        <div className="mt-8 space-y-4">
          <div>
            <p className="text-xs text-gray-500">Username</p>
            <p className="font-medium text-gray-800">{user?.username || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-medium text-gray-800">{user?.fullName || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user?.email || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
