import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAvatar } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import { ArrowLeft, Camera } from "lucide-react";

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
      setMessage("Avatar updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1
          className="text-2xl font-semibold text-slate-900 mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          My Profile
        </h1>

        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={preview || "https://placehold.co/200x200"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-100"
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center cursor-pointer transition">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-md transition flex items-center gap-2"
              >
                {loading && <Spinner />}
                {loading ? "Uploading..." : "Upload Avatar"}
              </button>
            )}

            {message && (
              <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-md">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-md">
                {error}
              </p>
            )}
          </div>

          <div className="mt-10 divide-y divide-slate-100">
            <div className="py-3 flex justify-between">
              <p className="text-sm text-slate-500">Username</p>
              <p className="text-sm font-medium text-slate-900">
                {user?.username || "—"}
              </p>
            </div>
            <div className="py-3 flex justify-between">
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="text-sm font-medium text-slate-900">
                {user?.fullName || "—"}
              </p>
            </div>
            <div className="py-3 flex justify-between">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900">
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
