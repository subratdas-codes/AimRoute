import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.PNG";

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on every route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setOpen(false);        // close dropdown first
    logout();              // clear user from context + localStorage
    navigate("/login");    // redirect
  };

  // Close dropdown when clicking outside
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

          <Link to="/services" className="hover:text-pink-200 transition">
            Services
          </Link>

          <Link to="/career-path" className="hover:text-pink-200 transition">
            Explore Path 🚀
          </Link>

          {/* Guest */}
          {!user && (
            <Link
              to="/login"
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              Login
            </Link>
          )}

          {/* Logged in */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(prev => !prev)}
                className="bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                👤
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-lg overflow-hidden">

                  

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard");
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-purple-50 text-sm"
                  >
                    📊 Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-sm border-t border-gray-100"
                  >
                     ⚙️ Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-sm border-t border-gray-100"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
          )}

        </div>
      </nav>
    </div>
  );
}

export default Navbar;