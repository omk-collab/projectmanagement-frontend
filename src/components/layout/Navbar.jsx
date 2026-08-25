import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

function Navbar({ showBack, backTo = "/dashboard" }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack ? (
            <Link
              to={backTo}
              className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1 transition"
            >
              <span aria-hidden>←</span> Back
            </Link>
          ) : (
            <span className="font-semibold text-slate-900 tracking-tight">
              Project Camp
            </span>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md transition"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
