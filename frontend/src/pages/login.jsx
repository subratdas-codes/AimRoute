import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import bgImage from "../assets/login-bg.jpg";

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

function ForgotPasswordModal({ onClose }) {
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Reset link sent! Check your inbox.");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
        onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Forgot password?</h3>
        <p className="text-sm text-gray-500 mb-5">
          Enter your email and we'll send a reset link.
        </p>
        {message && (
          <p className="text-green-700 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
        <form onSubmit={handleSend} className="space-y-4">
          <input type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <button onClick={onClose}
          className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [formData,     setFormData]     = useState({
    email: location.state?.email || "",
    password: ""
  });
  const [error,        setError]        = useState("");
  const [successMsg,   setSuccessMsg]   = useState(
    location.state?.registered
      ? `Account created! Sign in with ${location.state.email}`
      : ""
  );
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot,   setShowForgot]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error)      setError("");
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api.post("/auth/login", {
        email:    formData.email,
        password: formData.password,
      });
      const { access_token, name } = res.data;
      localStorage.setItem("token", access_token);
      login({ name, email: formData.email });
      const hasResult = localStorage.getItem("career_result");
      navigate(hasResult ? "/result" : "/");
    } catch (err) {
      const msg = err.response?.data?.detail;
      if      (msg === "User not found")   setError("No account found with this email.");
      else if (msg === "Invalid password") setError("Incorrect password.");
      else                                 setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen bg-cover bg-center relative pt-24"
        style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">

            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-white/60 text-sm text-center mb-8">
              Sign in to your AimRoute account
            </p>

            {/* Success message from signup redirect */}
            {successMsg && (
              <div className="flex items-center gap-2 text-green-300 text-sm mb-5 bg-green-900/20 py-3 px-4 rounded-xl border border-green-400/20">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-300 text-sm mb-5 bg-red-900/20 py-3 px-4 rounded-xl border border-red-400/20">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Email</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={formData.password}
                    onChange={handleChange} placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
                  />
                  <EyeIcon show={showPassword} onToggle={() => setShowPassword(p => !p)} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-xs text-pink-300 hover:text-pink-200 hover:underline transition">
                    Forgot password?
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-white">
              Don't have an account?{" "}
              <Link to="/signup" className="text-pink-300 font-medium hover:underline">
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;