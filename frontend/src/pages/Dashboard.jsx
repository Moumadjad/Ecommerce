import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Logged in as {user.email} ({user.role})
        </p>
        <button
          type="button"
          onClick={logout}
          className="rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
