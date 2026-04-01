import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import bgImage from "../assets/login-bg.jpg";
import API from "../services/api"

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setError("All fields are required.");
    return;
  }

  try {
    const response = await loginUser({
      email: formData.email,
      password: formData.password,
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    // ✅ Use name from API response — it's right there
    login({
      name: response.data.name,
      email: formData.email,
    });

    navigate("/");

  } catch (err) {
    setError(err.response?.data?.detail || "Invalid email or password");
  }
};

 const handleForgotPassword = async (e) => {
  e.preventDefault();
  if (!forgotEmail) {
    setForgotMessage("Please enter your email address.");
    return;
  }
  setForgotLoading(true);
  try {
    await API.post("/auth/forgot-password", { email: forgotEmail });
    setForgotMessage(
      "If this email is registered, you will receive a reset link shortly. Check your inbox."
    );
  } catch (err) {
    setForgotMessage(
      "If this email is registered, you will receive a reset link shortly."
    );
  } finally {
    setForgotLoading(false);
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">

          {/* FORGOT PASSWORD MODE */}
          {forgotMode ? (
            <>
              <button
                onClick={() => { setForgotMode(false); setForgotMessage(""); }}
                className="text-white/70 text-sm mb-6 flex items-center gap-1 hover:text-white transition"
              >
                ← Back to login
              </button>

              <h2 className="text-3xl font-bold text-white text-center mb-2">
                Reset Password
              </h2>
              <p className="text-white/70 text-sm text-center mb-8">
                Enter your registered email. We'll send you a reset link.
              </p>

              {forgotMessage && (
                <p className="text-green-300 text-sm mb-4 text-center bg-green-900/30 py-2 px-4 rounded-lg">
                  {forgotMessage}
                </p>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (

            /* NORMAL LOGIN MODE */
            <>
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Welcome Back
              </h2>

              {error && (
                <p className="text-red-300 text-sm mb-4 text-center bg-red-900/20 py-2 px-4 rounded-lg">
                  {error}
                </p>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* PASSWORD WITH EYE ICON */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      {showPassword ? (
                        // Eye-off icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        // Eye icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* FORGOT PASSWORD LINK */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setError(""); }}
                    className="text-pink-300 text-sm hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  Login
                </button>
              </form>

              <p className="text-sm text-center mt-6 text-white">
                Don't have an account?{" "}
                <Link to="/signup" className="text-pink-300 font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;