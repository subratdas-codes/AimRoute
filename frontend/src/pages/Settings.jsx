import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import API                     from "../services/api";

// ── Eye icon (consistent with login + reset pages) ────────────
function EyeIcon({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
      {show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );
}

// ── Password strength bar ─────────────────────────────────────
function StrengthBar({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const meta  = [
    null,
    { label:"Very weak", color:"bg-red-500"   },
    { label:"Weak",      color:"bg-orange-400" },
    { label:"Fair",      color:"bg-amber-400"  },
    { label:"Strong",    color:"bg-green-500"  },
    { label:"Very strong",color:"bg-green-600" },
  ][score];
  const textColor = ["","text-red-500","text-orange-500","text-amber-600","text-green-600","text-green-700"][score];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? meta.color : "bg-gray-100"}`} />
        ))}
      </div>
      <p className={`text-xs mt-1 font-medium ${textColor}`}>{meta.label}</p>
    </div>
  );
}

// ── Re-auth modal — shown before password change form appears ─
function ReAuthModal({ onVerified, onClose }) {
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

 const handleVerify = async (e) => {
  e.preventDefault();
  if (!password) { setError("Please enter your current password."); return; }
  setLoading(true); setError("");
  try {
    await API.post("/users/verify-password", { password }); // ← changed from /auth/
    onVerified(password);
  } catch {
    setError("Incorrect password. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor:"rgba(0,0,0,0.45)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-800 text-center mb-1">Confirm your identity</h3>
        <p className="text-xs text-gray-500 text-center mb-5">
          Enter your current password to continue
        </p>
        {error && <p className="text-red-600 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Current password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-10
                         focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <EyeIcon show={show} onToggle={() => setShow(p => !p)} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold
                       hover:bg-purple-700 transition disabled:opacity-50">
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </form>
        <button onClick={onClose} className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────
function DeleteModal({ onConfirm, onClose, loading }) {
  const [typed, setTyped] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor:"rgba(0,0,0,0.45)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-800 text-center mb-1">Delete your account?</h3>
        <p className="text-xs text-gray-500 text-center mb-2">
          This will permanently delete your account, all quiz results, and saved data. This cannot be undone.
        </p>
        <p className="text-xs text-center font-medium text-gray-700 mb-4">
          Type <span className="text-red-600 font-bold">DELETE</span> to confirm
        </p>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Type DELETE"
          className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm mb-4
                     focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== "DELETE" || loading}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold
                       hover:bg-red-700 transition disabled:opacity-40">
            {loading ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings page ────────────────────────────────────────
export default function Settings() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  // Re-auth gate
  const [reAuthOpen,      setReAuthOpen]      = useState(false);
  const [reAuthDone,      setReAuthDone]       = useState(false);
  const [verifiedPassword,setVerifiedPassword] = useState("");

  // Password form
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [pwLoading,       setPwLoading]       = useState(false);
  const [pwSuccess,       setPwSuccess]       = useState("");
  const [pwError,         setPwError]         = useState("");

  // Delete
  const [deleteOpen,      setDeleteOpen]      = useState(false);
  const [deleteLoading,   setDeleteLoading]   = useState(false);

  // Quiz preferences (saved to localStorage)
  const [prefLevel, setPrefLevel] = useState(() => localStorage.getItem("pref_level") || "");
  const [prefState, setPrefState] = useState(() => localStorage.getItem("pref_state") || "");

  // Account stats
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard/")
      .then(r => setStats({
        total:   r.data.total_attempts || 0,
        top:     r.data.latest?.top_career || "—",
        level:   r.data.latest?.level || "—",
      }))
      .catch(() => {});
  }, []);

  const savePref = (key, val, setter) => {
    setter(val);
    localStorage.setItem(key, val);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    if (newPassword.length < 6)           { setPwError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword)   { setPwError("Passwords do not match."); return; }
    if (verifiedPassword === newPassword)  { setPwError("New password must be different from current password."); return; }
    setPwLoading(true);
    try {
      await API.post("/users/change-password", {
        current_password: verifiedPassword,
        new_password:     newPassword,
      });
      setPwSuccess("Password changed successfully!");
      setNewPassword(""); setConfirmPassword("");
      setReAuthDone(false); setVerifiedPassword("");
    } catch (err) {
      setPwError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await API.delete("/users/me");
      logout();
      navigate("/");
    } catch {
      setDeleteLoading(false);
      setDeleteOpen(false);
      alert("Failed to delete account. Please try again.");
    }
  };

  const [downloadMsg, setDownloadMsg] = useState("");

  const handleDownloadData = async () => {
    try {
      const r = await API.get("/results/my");

      if (!r.data || r.data.length === 0) {
        setDownloadMsg("no-data");
        setTimeout(() => setDownloadMsg(""), 3500);
        return;
      }

      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `AimRoute_my_data_${r.data.length}_results.json`;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadMsg("success");
      setTimeout(() => setDownloadMsg(""), 3500);
    } catch {
      setDownloadMsg("error");
      setTimeout(() => setDownloadMsg(""), 3500);
    }
  };

  const confirmMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <>
      {reAuthOpen && (
        <ReAuthModal
          onVerified={(pw) => { setVerifiedPassword(pw); setReAuthDone(true); setReAuthOpen(false); }}
          onClose={() => setReAuthOpen(false)}
        />
      )}
      {deleteOpen && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onClose={() => setDeleteOpen(false)}
          loading={deleteLoading}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* ── HEADER ── */}
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-200 transition text-gray-500 text-lg">
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-400">Manage your account and preferences</p>
            </div>
          </div>

          {/* ── ACCOUNT STATS ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || "—"}</p>
                <p className="text-sm text-gray-400">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:"Quizzes taken",    value: stats?.total ?? "—" },
                { label:"Top career match", value: stats?.top   ?? "—" },
                { label:"Latest level",     value: stats?.level === "grad" ? "Graduation" : stats?.level === "pg" ? "Post Grad" : stats?.level ?? "—" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUIZ PREFERENCES ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Quiz Preferences
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Pre-fill your quiz and college filter settings so you don't re-enter them every time.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Default education level</label>
                <select
                  value={prefLevel}
                  onChange={e => savePref("pref_level", e.target.value, setPrefLevel)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                >
                  <option value="">No preference</option>
                  <option value="10th">10th Grade</option>
                  <option value="12th">12th Grade</option>
                  <option value="grad">Graduation</option>
                  <option value="pg">Post Graduation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Default state (college filter)</label>
                <select
                  value={prefState}
                  onChange={e => savePref("pref_state", e.target.value, setPrefState)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                >
                  <option value="">No preference</option>
                  {["Andhra Pradesh","Bihar","Delhi","Gujarat","Karnataka","Kerala",
                    "Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan",
                    "Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            {(prefLevel || prefState) && (
              <p className="text-xs text-green-600 mt-3 font-medium">
                ✓ Preferences saved — these will pre-fill your next quiz and college filter.
              </p>
            )}
          </div>

          {/* ── CHANGE PASSWORD ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Change Password
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              You'll be asked to verify your current password before making changes.
            </p>

            {!reAuthDone ? (
              /* ── Gate: verify identity first ── */
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Identity verification required</p>
                <p className="text-xs text-gray-400 mb-4">
                  Confirm your current password before setting a new one.
                </p>
                <button
                  onClick={() => setReAuthOpen(true)}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold
                             hover:bg-purple-700 transition">
                  Verify identity →
                </button>
              </div>
            ) : (
              /* ── Unlocked: show change password form ── */
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50
                                border border-green-200 rounded-xl px-3 py-2 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  Identity verified — you can now set a new password.
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">New password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-10
                                 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <EyeIcon show={showNew} onToggle={() => setShowNew(p => !p)} />
                  </div>
                  <StrengthBar password={newPassword} />
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm new password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className={`w-full border rounded-xl px-4 py-3 text-sm pr-10
                                 focus:outline-none focus:ring-2
                                 ${confirmMismatch
                                   ? "border-red-300 bg-red-50 focus:ring-red-400"
                                   : confirmPassword && !confirmMismatch
                                   ? "border-green-300 bg-green-50 focus:ring-green-400"
                                   : "border-gray-200 focus:ring-purple-400"}`}
                    />
                    <EyeIcon show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                  </div>
                  {confirmMismatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                  {confirmPassword && !confirmMismatch && (
                    <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                  )}
                </div>

                {pwError   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{pwError}</div>}
                {pwSuccess && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">{pwSuccess}</div>}

                <div className="flex gap-3">
                  <button type="button"
                    onClick={() => { setReAuthDone(false); setVerifiedPassword(""); setPwError(""); setPwSuccess(""); setNewPassword(""); setConfirmPassword(""); }}
                    className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={pwLoading || confirmMismatch || !newPassword}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold
                               hover:bg-purple-700 transition disabled:opacity-50">
                    {pwLoading ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── PRIVACY & DATA ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Privacy & Data
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Control and export your personal data stored on AimRoute.
            </p>
            <div className="space-y-3">
              {/* Download data */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Download my data</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Export all your quiz results as a JSON file
                  </p>
                  {/* Inline feedback messages */}
                  {downloadMsg === "success" && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✓ Downloaded to your Downloads folder
                    </p>
                  )}
                  {downloadMsg === "no-data" && (
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      No saved results yet — take a quiz and save your result first
                    </p>
                  )}
                  {downloadMsg === "error" && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      Download failed — please try again
                    </p>
                  )}
                </div>
                <button
                  onClick={handleDownloadData}
                  className={`px-4 py-2 text-xs font-semibold border rounded-xl transition shrink-0 ml-4
                    ${downloadMsg === "success"
                      ? "border-green-300 text-green-700 bg-green-50"
                      : "border-gray-200 text-gray-700 hover:bg-white"}`}
                >
                  {downloadMsg === "success" ? "Downloaded ✓" : "Download ↓"}
                </button>
              </div>
              {/* Clear preferences */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Clear quiz preferences</p>
                  <p className="text-xs text-gray-400 mt-0.5">Reset your saved level and state defaults</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("pref_level");
                    localStorage.removeItem("pref_state");
                    setPrefLevel(""); setPrefState("");
                  }}
                  className="px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-700
                             rounded-xl hover:bg-white transition shrink-0 ml-4">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* ── DANGER ZONE ── */}
          <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">
              Danger Zone
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Permanent actions — these cannot be undone.
            </p>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-800">Delete my account</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Permanently removes your account and all quiz history
                </p>
              </div>
              <button
                onClick={() => setDeleteOpen(true)}
                className="px-4 py-2 text-xs font-semibold border border-red-300 text-red-600
                           rounded-xl hover:bg-red-100 transition shrink-0 ml-4">
                Delete
              </button>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="grid grid-cols-2 gap-3 pb-8">
            <button onClick={() => navigate("/dashboard")}
              className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-sm transition">
              <div className="text-xl mb-2">📊</div>
              <div className="text-sm font-semibold text-gray-800">Dashboard</div>
              <div className="text-xs text-gray-400">View your quiz history</div>
            </button>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-sm transition">
              <div className="text-xl mb-2">🚪</div>
              <div className="text-sm font-semibold text-red-600">Logout</div>
              <div className="text-xs text-gray-400">Sign out of your account</div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}