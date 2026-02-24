import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Later: Save to backend or localStorage

    navigate("/login");  // ✅ Redirect to Login page
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Signup Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 
                        p-10 rounded-3xl shadow-2xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Create Account
          </h2>

          {error && (
            <p className="text-red-300 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm text-white mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-1">
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
              <label className="block text-sm text-white mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 
                         text-white py-3 rounded-lg font-semibold 
                         hover:opacity-90 transition duration-300"
            >
              Sign Up
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