import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";
import Spinner from "../components/common/Spinner";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

function Login() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(formData);
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      await refetchUser();
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (
        typeof data === "string" &&
        data.includes("Please verify your email")
      ) {
        setError("Please verify your email before logging in");
      } else if (
        typeof data === "string" &&
        data.includes("Invalid credentials")
      ) {
        setError("Invalid credentials");
      } else if (err.request && !err.response) {
        setError("Server is waking up, please try again in a few seconds.");
      } else {
        setError(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <AuthVisualPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="lg:hidden block text-center text-sm font-semibold text-slate-900 mb-8 tracking-tight"
          >
            Project Camp
          </Link>

          <h2 className="text-2xl font-semibold text-slate-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Login to continue to Project Camp
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2.5 pr-11 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-md transition flex items-center justify-center gap-2"
            >
              {loading && <Spinner />}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <GoogleLoginButton />

          <p className="text-sm text-slate-600 mt-8 text-center">
            New here?{" "}
            <Link
              to="/register"
              className="text-slate-900 font-medium underline underline-offset-2"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
