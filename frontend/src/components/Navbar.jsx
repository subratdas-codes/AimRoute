import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const ADMIN_EMAILS = ["aimroute.noreply@gmail.com"];

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen]        = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef            = useRef();
  const navigate               = useNavigate();
  const location               = useLocation();

  useEffect(() => { setOpen(false); setMobileOpen(false); }, [location.pathname]);

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
    if (user?.name?.length  > 0) return user.name[0].toUpperCase();
    if (user?.email?.length > 0) return user.email[0].toUpperCase();
    return "U";
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm transition-colors hover:drop-shadow-sm ${
      isActive(path)
        ? "text-white font-bold border-b-2 border-white/70 pb-0.5"
        : "text-white/85 hover:text-white font-medium"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-700 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <img src={logo} alt="AimRoute Logo"
            className="h-15 w-auto rounded-full object-contain bg-transparent" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Aim<span className="text-pink-200">Route</span>
            </span>
            <span className="text-[9px] font-medium tracking-[0.18em] text-white/60 uppercase mt-0.5">
              AI Career Guidance
            </span>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/"            className={linkClass("/")}>Home</Link>
          <Link to="/services"    className={linkClass("/services")}>Services</Link>
          <Link to="/career-path" className={`${linkClass("/career-path")} flex items-center gap-1`}>
            Explore Path <span className="text-xs">🚀</span>
          </Link>

          {/* Compare — only when logged in */}
          {user && (
            <Link to="/compare" className={`${linkClass("/compare")} flex items-center gap-1.5`}>
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
          )}

          {/* Guest login button */}
          {!user && (
            <Link to="/login"
              className="bg-white text-purple-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-pink-50 transition shadow-md hover:shadow-lg">
              Login
            </Link>
          )}

          {/* Logged in avatar + dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(p => !p)}
                className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform shadow-md ring-2 ring-white/40 hover:ring-white/80 relative">
                {getInitial()}
                {isAdmin && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs leading-none">👑</span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-50">

                  {/* User info */}
                  <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
                        {getInitial()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                        {isAdmin && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-semibold rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Panel */}
                  {isAdmin && (
                    <button onClick={() => { setOpen(false); navigate("/admin"); }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors border-b border-gray-100">
                      <span className="text-base">🛡️</span>
                      <span className="font-semibold text-purple-600">Admin Panel</span>
                    </button>
                  )}

                  {/* Dashboard */}
                  <button onClick={() => { setOpen(false); navigate("/dashboard"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors">
                    <span className="text-base">📊</span>
                    <span className="font-medium text-gray-700">Dashboard</span>
                  </button>

                  {/* Compare — in dropdown too */}
                  <button onClick={() => { setOpen(false); navigate("/compare"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors border-t border-gray-50">
                    <span className="text-base">⚖️</span>
                    <span className="font-medium text-gray-700">Compare Careers</span>
                  </button>

                  {/* Settings */}
                  <button onClick={() => { setOpen(false); navigate("/settings"); }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm flex items-center gap-3 transition-colors border-t border-gray-50">
                    <span className="text-base">⚙️</span>
                    <span className="font-medium text-gray-700">Settings</span>
                  </button>

                  {/* Logout */}
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-3 transition-colors border-t border-gray-100">
                    <span className="text-base">🚪</span>
                    <span className="font-medium text-red-500">Logout</span>
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button onClick={() => setMobileOpen(o => !o)}
          className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur border-t border-white/20 px-6 py-4 space-y-1">
          {[
            { to: "/",            label: "Home"         },
            { to: "/services",    label: "Services"     },
            { to: "/career-path", label: "Explore Path 🚀" },
          ].map(link => (
            <Link key={link.to} to={link.to}
              className="block py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              <Link to="/compare"
                className="block py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
                ⚖️ Compare Careers
              </Link>
              <Link to="/dashboard"
                className="block py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
                📊 Dashboard
              </Link>
              <Link to="/settings"
                className="block py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
                ⚙️ Settings
              </Link>
              {isAdmin && (
                <Link to="/admin"
                  className="block py-2.5 text-purple-200 hover:text-white text-sm font-semibold transition-colors">
                  🛡️ Admin Panel
                </Link>
              )}
              <button onClick={handleLogout}
                className="block w-full text-left py-2.5 text-red-300 hover:text-red-200 text-sm font-medium transition-colors border-t border-white/20 mt-2 pt-4">
                🚪 Logout
              </button>
            </>
          )}

          {!user && (
            <Link to="/login"
              className="block py-2.5 text-white font-semibold text-sm">
              Login →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;