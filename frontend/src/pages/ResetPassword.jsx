// frontend/src/pages/ResetPassword.jsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import bgImage from "../assets/login-bg.jpg";

// ── Reusable eye toggle icon ──────────────────────────────────
function EyeIcon({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );
}

// ── Password strength indicator ───────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const label = ["", "Weak", "Weak", "Fair", "Strong", "Very strong"][score];
  const color = ["", "bg-red-400", "bg-red-400", "bg-amber-400", "bg-green-400", "bg-green-600"][score];
  const textColor = ["", "text-red-400", "text-red-400", "text-amber-500", "text-green-500", "text-green-600"][score];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColor}`}>{label}</p>
    </div>
  );
}

// ── ResetPassword page ────────────────────────────────────────
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token    = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message,         setMessage]         = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [done,            setDone]            = useState(false);

  // Real-time confirm match feedback
  const confirmMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        token:        token,
        new_password: newPassword,
      });
      setDone(true);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">

          {done ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-400/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password updated!</h2>
              <p className="text-white/70 text-sm">Redirecting you to login...</p>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                Set New Password
              </h2>
              <p className="text-white/60 text-sm text-center mb-8">
                Enter your new password below.
              </p>

              {message && (
                <p className="text-green-300 text-sm mb-4 text-center bg-green-900/30 py-2 px-4 rounded-lg">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-300 text-sm mb-4 text-center bg-red-900/20 py-2 px-4 rounded-lg">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

                {/* New password */}
                <div>
                  <label className="block text-sm text-white mb-1">New password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
                    />
                    <EyeIcon show={showNew} onToggle={() => setShowNew(p => !p)} />
                  </div>
                  {/* Strength meter */}
                  <PasswordStrength password={newPassword} />
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm text-white mb-1">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                        confirmMismatch
                          ? "focus:ring-red-400 ring-2 ring-red-400"
                          : "focus:ring-purple-400"
                      }`}
                    />
                    <EyeIcon show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                  </div>
                  {confirmMismatch && (
                    <p className="text-red-300 text-xs mt-1">Passwords don't match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || confirmMismatch}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-center text-white/50 text-xs mt-6">
                Remembered it?{" "}
                <a href="/login" className="text-pink-300 hover:underline">Back to login</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;