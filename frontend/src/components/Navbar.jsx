import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.PNG";

function Navbar() {

  const { user, logout } = useAuth();   // 🔐 AuthContext
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                // remove user from context
    navigate("/login");      // redirect to login
  };

  // close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-700 text-white shadow-md">

      <nav className="flex items-center justify-between px-3 h-17">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="AimRoute Logo"
            className="h-15 w-auto rounded-full object-contain bg-transparent"
          />
          <span className="text-xl font-bold tracking-wide ml-2">
            AimRoute
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-8 font-medium">

          <Link to="/" className="hover:text-pink-200 transition">
            Home
          </Link>

          <Link to="/quiz" className="hover:text-pink-200 transition">
            Career Test
          </Link>

          <Link to="/services" className="hover:text-pink-200 transition">
            Services
          </Link>

          {/* Guest User */}
          {!user && (
            <Link
              to="/login"
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              Login
            </Link>
          )}

          {/* Logged-in User */}
          {user && (
            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setOpen(!open)}
                className="bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                👤
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-lg">

                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/history")}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50"
                  >
                    Decision History
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50"
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </nav>
=======

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "15px", background: "#eee" }}>
      <Link to="/">Home</Link> |{" "}
      {!token && <Link to="/login">Login</Link>} |{" "}
      {!token && <Link to="/signup">Signup</Link>} |{" "}
      {token && <Link to="/dashboard">Dashboard</Link>} |{" "}
      {token && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
>>>>>>> develop
    </div>
  );
}

export default Navbar;