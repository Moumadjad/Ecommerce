import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/admin" className="font-semibold text-gray-900 dark:text-gray-100">
            Admin
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.name}</p>
          <Link
            to="/"
            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Back to store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
