import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";
import Spinner from "../components/common/Spinner";
import { getErrorMessage } from "../utils/getErrorMessage";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccessMsg(res.data.message || "Reset link sent! Check your email.");
    } catch (err) {
      setError(getErrorMessage(err));
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
            Forgot your password?
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-md transition flex items-center justify-center gap-2"
            >
              {loading && <Spinner />}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-8 text-center">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-medium underline underline-offset-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
