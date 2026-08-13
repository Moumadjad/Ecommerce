import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-gray-900 dark:text-gray-100">
          E-Commerce
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Products
          </Link>
          <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Cart{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                My orders
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Admin
                </Link>
              )}
              <span className="text-gray-400 dark:text-gray-500">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Log in
              </Link>
              <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
