import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const getInitials = (user) =>
  (user?.fullName || user?.username || "RC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="nav-shell">
      <div className="content-shell flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="brand-mark text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-display truncate text-sm font-semibold text-[var(--text-primary)] md:text-base">
            Relocation Companion
          </p>
        </Link>

      

        {isAuthenticated ? (
          <div className="flex flex-shrink-0 items-center gap-3">
            <Link to="/saved-moves" className="nav-action nav-action-subtle hidden md:inline-flex">
              Saved Moves
            </Link>
            <Link to="/profile" className="avatar-button" aria-label="Open profile" title="Profile">
              {getInitials(user)}
            </Link>
          </div>
        ) : (
          <div className="flex flex-shrink-0 items-center gap-3">
            <Link to="/login" className="nav-action hidden sm:inline-flex">
              Log In
            </Link>
            <Link to="/register" className="primary-button h-10 px-4 text-sm">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
