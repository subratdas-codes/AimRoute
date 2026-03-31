// frontend/src/components/Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.PNG";

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);
  const dropdownRef      = useRef();
  const navigate         = useNavigate();
  const location         = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-700 text-white shadow-md">
      <nav className="flex items-center justify-between px-3 h-17">

        <Link to="/" className="flex items-center">
          <img src={logo} alt="AimRoute Logo" className="h-15 w-auto rounded-full object-contain bg-transparent" />
          <span className="text-xl font-bold tracking-wide ml-2">AimRoute</span>
        </Link>

        <div className="flex items-center space-x-8 font-medium">
          <Link to="/"            className="hover:text-pink-200 transition">Home</Link>
          <Link to="/services"    className="hover:text-pink-200 transition">Services</Link>
          <Link to="/career-path" className="hover:text-pink-200 transition">Explore Path 🚀</Link>

          {/* Guest — show Login button */}
          {!user && (
            <Link to="/login"
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition font-semibold">
              Login
            </Link>
          )}

          {/* Logged in — avatar dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(p => !p)}
                className="bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 transition font-bold text-sm"
              >
                {user.name?.[0]?.toUpperCase() || "👤"}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-purple-50">
                    <p className="text-sm font-semibold text-purple-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  <button onClick={() => { setOpen(false); navigate("/dashboard"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-2">
                    📊 <span>Dashboard</span>
                  </button>

                  <button onClick={() => { setOpen(false); navigate("/settings"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-2 border-t border-gray-100">
                    ⚙️ <span>Settings</span>
                  </button>

                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 border-t border-gray-100">
                    🚪 <span>Logout</span>
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