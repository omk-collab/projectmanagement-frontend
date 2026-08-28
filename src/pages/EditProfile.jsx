import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateAccountDetails } from "../api/auth.api";

function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await updateAccountDetails({
        fullName: formData.fullName,
        username: formData.username,
      });

      const updatedUser = res.data.data;

      // AuthContext update
      setUser(updatedUser);

      // localStorage update
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")}
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Profile
          </button>

          <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>

          <div></div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={user?.avatar?.url || "https://placehold.co/150x150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow"
            />

            <button
              type="button"
              className="mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              Change Avatar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />

              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed here.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                ✓ {success}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
