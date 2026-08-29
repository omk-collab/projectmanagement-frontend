import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateAccountDetails } from "../api/auth.api";
import Spinner from "../components/common/Spinner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1
            className="text-base font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Edit Profile
          </h1>
          <div className="w-24" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src={user?.avatar?.url || "https://placehold.co/150x150"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-100"
            />
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="mt-3 text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              Change avatar from Profile page
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2.5 border border-slate-200 rounded-md bg-slate-50 text-slate-400 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed here.
              </p>
            </div>

            {error && (
              <p className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 border border-slate-300 text-slate-700 text-sm font-medium py-2.5 rounded-md hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-md transition flex items-center justify-center gap-2"
              >
                {loading && <Spinner />}
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
