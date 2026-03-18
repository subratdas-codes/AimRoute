import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/login-bg.jpg";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    login({ name: formData.email });

    navigate("/");   // ✅ Redirect to Home page
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 
                        p-10 rounded-3xl shadow-2xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-300 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 
                         text-white py-3 rounded-lg font-semibold 
                         hover:opacity-90 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-white">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-pink-300 font-medium hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;