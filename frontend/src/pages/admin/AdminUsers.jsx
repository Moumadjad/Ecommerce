import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { CheckCircleIcon, EyeIcon, SearchIcon, ShieldIcon, TrashIcon, XCircleIcon } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import { btn, card, input } from "../../lib/ui";

const PAGE_SIZES = [10, 20, 50, 100];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== search) {
        setPage(1);
        setSearch(trimmed);
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function load() {
    setLoading(true);
    api
      .get("/users", { params: { page, limit, search: search || undefined } })
      .then(({ data }) => {
        setUsers(data.users);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page, limit, search]);

  async function handleToggleRole(user) {
    setUpdatingId(user._id);
    try {
      await api.put(`/users/${user._id}`, { role: user.role === "admin" ? "customer" : "admin" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleActive(user) {
    setUpdatingId(user._id);
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        Users
      </h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className={input("pl-9")}
          />
        </div>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className={input("sm:w-40")}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

      {!loading && users.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
      )}

      {users.length > 0 && (
        <div className={card("overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((user) => {
                const isSelf = user._id === currentUser.id;
                return (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 pl-5 pr-4 text-gray-900 dark:text-gray-100">
                      {user.name}
                      {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/orders?user=${user._id}&customerName=${encodeURIComponent(user.name)}`}
                          aria-label="View orders"
                          title="View orders"
                          className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(user)}
                          disabled={isSelf || updatingId === user._id}
                          aria-label={user.role === "admin" ? "Remove admin role" : "Make admin"}
                          title={
                            isSelf
                              ? "You cannot modify your own account"
                              : user.role === "admin"
                                ? "Remove admin role"
                                : "Make admin"
                          }
                          className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ShieldIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          disabled={isSelf || updatingId === user._id}
                          aria-label={user.isActive ? "Deactivate user" : "Activate user"}
                          title={
                            isSelf
                              ? "You cannot modify your own account"
                              : user.isActive
                                ? "Deactivate user"
                                : "Activate user"
                          }
                          className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          {user.isActive ? (
                            <XCircleIcon className="h-4 w-4" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={isSelf}
                          aria-label="Delete user"
                          title={isSelf ? "You cannot delete your own account" : "Delete user"}
                          className="inline-flex text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={btn("secondary", "sm", "disabled:opacity-40")}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className={btn("secondary", "sm", "disabled:opacity-40")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
