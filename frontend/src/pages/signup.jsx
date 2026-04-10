import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });
  const [error,            setError]            = useState("");
  const [loading,          setLoading]          = useState(false);
  const [showPassword,     setShowPassword]     = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (error) setError("");
    if (name === "password") {
      let s = 0;
      if (value.length >= 6)             s++;
      if (value.length >= 10)            s++;
      if (/[A-Z]/.test(value))           s++;
      if (/[0-9]/.test(value))           s++;
      if (/[^A-Za-z0-9]/.test(value))    s++;
      setPasswordStrength(s);
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-emerald-500",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required."); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        password: formData.password,
      });
      // Redirect to login with success state — email pre-filled
      navigate("/login", {
        state: { registered: true, email: formData.email.trim() }
      });
    } catch (err) {
      const msg = err.response?.data?.detail;
      if      (msg === "Email already registered") setError("An account with this email already exists.");
      else if (msg)                                setError(msg);
      else                                         setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.confirmPassword &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-cover bg-center relative pt-16"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex items-center justify-center min-h-[85vh] px-4 py-8">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Create Account
          </h2>
          <p className="text-white/60 text-sm text-center mb-8">
            Join AimRoute — completely free
          </p>

          {error && (
            <div className="flex items-center gap-2 text-red-300 text-sm mb-5 bg-red-900/20 py-3 px-4 rounded-xl border border-red-400/20">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Full Name</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Enter your full name"
                autoComplete="name"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
                />
                <EyeIcon show={showPassword} onToggle={() => setShowPassword(p => !p)} />
              </div>

              {/* Strength bar */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${i <= passwordStrength ? strengthColor[passwordStrength] : "bg-white/20"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-white/60">
                    {strengthLabel[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none pr-12
                    ${passwordsMismatch
                      ? "focus:ring-2 focus:ring-red-400 ring-2 ring-red-300"
                      : passwordsMatch
                        ? "focus:ring-2 focus:ring-green-400 ring-2 ring-green-300"
                        : "focus:ring-2 focus:ring-purple-400"}`}
                />
                <EyeIcon show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
              </div>
              {passwordsMismatch && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Passwords don't match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-green-300 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Passwords match
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-60 mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="text-sm text-center mt-6 text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-300 font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;