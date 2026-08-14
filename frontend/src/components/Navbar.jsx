import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { btn } from "../lib/ui";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? "text-gray-900 dark:text-white"
      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">
          E-Commerce
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              Cart
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                  {totalItems}
                </span>
              )}
            </span>
          </NavLink>

          {user ? (
            <>
              <NavLink to="/orders" className={navLinkClass}>
                My orders
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <div className="h-5 w-px bg-gray-200 dark:bg-gray-800" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{user.name}</span>
              <button type="button" onClick={handleLogout} className={btn("secondary", "sm")}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <NavLink to="/register" className={btn("primary", "sm")}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
