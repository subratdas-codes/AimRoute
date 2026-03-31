// frontend/src/pages/Settings.jsx
// Place at: frontend/src/pages/Settings.jsx
// Add route in App.jsx: <Route path="/settings" element={<Settings />} />

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Change password state ─────────────────────────────────
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [pwLoading, setPwLoading]               = useState(false);
  const [pwSuccess, setPwSuccess]               = useState("");
  const [pwError, setPwError]                   = useState("");

  // ── Show/hide password toggles ────────────────────────────
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  // ── Delete account state ──────────────────────────────────
  const [showDelete, setShowDelete]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirm password do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setPwError("New password must be different from current password.");
      return;
    }

    setPwLoading(true);
    try {
      await API.post("/users/change-password", {
        current_password: currentPassword,
        new_password:     newPassword,
      });
      setPwSuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setPwError(msg || "Failed to change password. Please check your current password.");
    } finally {
      setPwLoading(false);
    }
  };

  const passwordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
    if (pw.length < 8)  return { label: "Weak",     color: "bg-orange-400", width: "w-2/4" };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
                        return { label: "Medium",   color: "bg-yellow-400", width: "w-3/4" };
    return               { label: "Strong",   color: "bg-green-500",  width: "w-full" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-200 transition text-gray-500"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* ── PROFILE INFO (read-only) ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Profile Information
          </h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || "—"}</p>
              <p className="text-sm text-gray-400">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Full Name</p>
              <p className="text-sm font-medium text-gray-800">{user?.name || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Email Address</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* ── CHANGE PASSWORD ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
            Change Password
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Choose a strong password with at least 8 characters, one uppercase letter, and one number.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">

            {/* Current password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                />
                <button type="button"
                  onClick={() => setShowCurrent(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                />
                <button type="button"
                  onClick={() => setShowNew(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium
                    ${strength.label === "Strong" ? "text-green-600" :
                      strength.label === "Medium" ? "text-yellow-600" : "text-red-500"}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className={`w-full border rounded-xl px-4 py-3 text-sm pr-10
                             focus:outline-none focus:ring-2 focus:ring-purple-400
                             ${confirmPassword && confirmPassword !== newPassword
                               ? "border-red-300 bg-red-50"
                               : confirmPassword && confirmPassword === newPassword
                               ? "border-green-300 bg-green-50"
                               : "border-gray-200"}`}
                />
                <button type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
              )}
            </div>

            {/* Error / success */}
            {pwError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                {pwSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={pwLoading}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold
                         hover:bg-purple-700 transition disabled:opacity-50 text-sm"
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* ── DANGER ZONE ── */}
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-red-600 mb-1 uppercase tracking-wide">
            Danger Zone
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            These actions are permanent and cannot be undone.
          </p>

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm
                         font-semibold hover:bg-red-50 transition"
            >
              🗑️ Delete My Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className="w-full border border-red-300 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDelete(false); setDeleteConfirm(""); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== "DELETE"}
                  onClick={() => {
                    // Wire to DELETE /users/me endpoint when ready
                    logout();
                    navigate("/");
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold
                             hover:bg-red-700 transition disabled:opacity-40"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-sm transition"
          >
            <div className="text-xl mb-2">📊</div>
            <div className="text-sm font-semibold text-gray-800">Dashboard</div>
            <div className="text-xs text-gray-400">View your quiz history</div>
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-sm transition"
          >
            <div className="text-xl mb-2">🚪</div>
            <div className="text-sm font-semibold text-red-600">Logout</div>
            <div className="text-xs text-gray-400">Sign out of your account</div>
          </button>
        </div>

      </div>
    </div>
  );
}