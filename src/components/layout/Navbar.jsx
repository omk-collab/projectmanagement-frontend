import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore logout API error
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          Project Camp
        </div>

        {/* Right Side */}
        <div className="relative">
          {/* Profile Button */}
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            {/* Avatar */}
            <img
              src={user?.avatar?.url || "https://placehold.co/40x40"}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border"
            />

            {/* Username */}
            <span className="text-sm font-medium text-gray-700">
              {user?.fullName || user?.username || "User"}
            </span>

            {/* Arrow */}
            <span className="text-gray-500">{showMenu ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">
                  {user?.fullName || user?.username}
                </p>

                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
              >
                👤 Profile
              </button>

              {/* Edit Profile */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile/edit");
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
              >
                ✏️ Edit Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
