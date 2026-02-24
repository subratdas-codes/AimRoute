import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-700 text-white shadow-md">

      <nav className="flex items-center justify-between px-3 h-17">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div>
            <img
            src={logo}
            alt="AimRoute Logo"
            className="h-26 w-auto  mix-blend-multiply object-contain drop-shadow-xl transform transition hover:scale-110 -mb-6 "
            />
          </div>
        </Link>

        {/* Links */}
        <div className="space-x-8 font-medium">
          <Link to="/" className="hover:text-pink-200 transition">
            Home
          </Link>
          <Link to="/quiz" className="hover:text-pink-200 transition">
            Career Test
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;