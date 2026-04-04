// frontend/src/components/Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.PNG";

const ADMIN_EMAILS = ["admin@aimroute.com"]; // ← put your admin email here

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitial = () => {
    if (user?.name?.length > 0)  return user.name[0].toUpperCase();
    if (user?.email?.length > 0) return user.email[0].toUpperCase();
    return "U";
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-700 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* ── Logo + Wordmark ── */}
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="AimRoute Logo" className="h-15 w-auto rounded-full object-contain bg-transparent" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Aim<span className="text-pink-200">Route</span>
            </span>
            <span className="text-[9px] font-medium tracking-[0.18em] text-white/60 uppercase mt-0.5">
              AI Career Guidance
            </span>
          </div>
        </Link>

        {/* ── Nav links ── */}
        <div className="flex items-center gap-7 font-medium">

          <Link to="/" className="text-white/90 hover:text-white text-sm transition-colors hover:drop-shadow-sm">
            Home
          </Link>

          <Link to="/services" className="text-white/90 hover:text-white text-sm transition-colors hover:drop-shadow-sm">
            Services
          </Link>

          <Link to="/career-path" className="text-white/90 hover:text-white text-sm transition-colors hover:drop-shadow-sm flex items-center gap-1">
            Explore Path
            <span className="text-xs">🚀</span>
          </Link>

          {/* Guest — Login button */}
          {!user && (
            <Link
              to="/login"
              className="bg-white text-purple-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-pink-50 transition shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}

          {/* Logged in — Avatar + dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>

              {/* Avatar button — shows crown for admin */}
              <button
                onClick={() => setOpen(p => !p)}
                className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform shadow-md ring-2 ring-white/40 hover:ring-white/80 relative"
              >
                {getInitial()}
                {isAdmin && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs leading-none">👑</span>
                )}
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-50">

                  {/* User info header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
                        {getInitial()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.email || ""}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-semibold rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Panel — only for admins */}
                  {isAdmin && (
                    <button
                      onClick={() => { setOpen(false); navigate("/admin"); }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors border-b border-gray-100"
                    >
                      <span className="text-base">🛡️</span>
                      <span className="font-semibold text-purple-600">Admin Panel</span>
                    </button>
                  )}

                  {/* Dashboard */}
                  <button
                    onClick={() => { setOpen(false); navigate("/dashboard"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors"
                  >
                    <span className="text-base">📊</span>
                    <span className="font-medium text-gray-700">Dashboard</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => { setOpen(false); navigate("/settings"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors border-t border-gray-50"
                  >
                    <span className="text-base">⚙️</span>
                    <span className="font-medium text-gray-700">Settings</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-3 transition-colors border-t border-gray-100"
                  >
                    <span className="text-base">🚪</span>
                    <span className="font-medium text-red-500">Logout</span>
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