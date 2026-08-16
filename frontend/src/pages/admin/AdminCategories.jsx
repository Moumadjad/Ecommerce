import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { CheckCircleIcon, PlusIcon, SearchIcon, TrashIcon, XCircleIcon } from "../../components/icons";
import { btn, card, input } from "../../lib/ui";

const PAGE_SIZES = [10, 20, 50, 100];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
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
      .get("/categories", { params: { page, limit, search: search || undefined, includeInactive: true } })
      .then(({ data }) => {
        setCategories(data.categories);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page, limit, search]);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await api.post("/categories", { name });
      setName("");
      load();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(category) {
    setUpdatingId(category._id);
    try {
      await api.put(`/categories/${category._id}`, { isActive: !category.isActive });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        Categories
      </h1>

      <form onSubmit={handleCreate} className={card("max-w-md p-5 mb-8 space-y-3")}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          New category
        </label>
        {createError && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {createError}
          </p>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Toys"
            required
            className={input()}
          />
          <button type="submit" disabled={creating} className={btn("primary")}>
            <PlusIcon className="h-4 w-4" />
            {creating ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search categories..."
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

      {!loading && categories.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
      )}

      {categories.length > 0 && (
        <div className={card("overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pl-5 pr-4 text-gray-900 dark:text-gray-100 capitalize">
                    {category.name}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(category)}
                        disabled={updatingId === category._id}
                        aria-label={category.isActive ? "Deactivate category" : "Activate category"}
                        title={category.isActive ? "Deactivate category" : "Activate category"}
                        className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors disabled:opacity-50"
                      >
                        {category.isActive ? (
                          <XCircleIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        aria-label="Delete category"
                        title="Delete category"
                        className="inline-flex text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
