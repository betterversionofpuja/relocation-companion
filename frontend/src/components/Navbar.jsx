import {
  MapPin,
  Bookmark,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="absolute top-5 left-4 right-4 sm:left-6 sm:right-6 z-50 flex items-center justify-between">

      {/* Logo */}

      <Link
        to="/"
        className="flex items-center gap-2 shrink-0"
      >
        <MapPin
          size={24}
          className="text-blue-500 shrink-0"
        />

        <span className="text-white text-[15px] sm:text-[17px] font-medium whitespace-nowrap">
          Relocation Companion
        </span>
      </Link>

      {/* Right Side */}

      <div className="flex items-center gap-3 sm:gap-6">

        {isLoggedIn ? (
          <>
            {/* Desktop */}

            <Link
              to="/saved-comparisons"
              className="hidden sm:block text-gray-300 hover:text-white transition text-sm"
            >
              Saved Comparisons
            </Link>

            <Link
              to="/profile"
              className="hidden sm:block text-gray-300 hover:text-white transition text-sm"
            >
              Profile
            </Link>

            {/* Mobile */}

            <Link
              to="/saved-comparisons"
              className="sm:hidden text-gray-300 hover:text-white transition"
            >
              <Bookmark size={20} />
            </Link>

            <Link
              to="/profile"
              className="sm:hidden text-gray-300 hover:text-white transition"
            >
              <User size={20} />
            </Link>
          </>
        ) : (
          <>
            {/* Desktop */}

            <Link
              to="/login"
              className="hidden sm:block text-gray-300 hover:text-white transition text-sm"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="hidden sm:block text-gray-300 hover:text-white transition text-sm"
            >
              Sign Up
            </Link>

            {/* Mobile */}

            <Link
              to="/login"
              className="sm:hidden text-gray-300 hover:text-white transition text-xs"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="sm:hidden text-gray-300 hover:text-white transition text-xs"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;