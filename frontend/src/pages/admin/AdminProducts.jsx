import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { CheckCircleIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, XCircleIcon } from "../../components/icons";
import { formatCurrency } from "../../lib/currency";
import { btn, card, input } from "../../lib/ui";

const PAGE_SIZES = [10, 20, 50, 100];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
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
      .get("/products", { params: { page, limit, search: search || undefined, includeInactive: true } })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page, limit, search]);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  }

  async function handleToggleActive(product) {
    setUpdatingId(product._id);
    try {
      await api.put(`/products/${product._id}`, { isActive: !product.isActive });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Products
        </h1>
        <Link to="/admin/products/new" className={btn("primary")}>
          <PlusIcon className="h-4 w-4" />
          New product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
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

      {!loading && products.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <div className={card("overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Stock</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pl-5 pr-4 text-gray-900 dark:text-gray-100">{product.name}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 capitalize">
                    {product.category?.name}
                    {product.category && !product.category.isActive && (
                      <span className="ml-1 text-xs text-gray-400">(inactive)</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        aria-label="Edit product"
                        title="Edit product"
                        className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product)}
                        disabled={updatingId === product._id}
                        aria-label={product.isActive ? "Deactivate product" : "Activate product"}
                        title={product.isActive ? "Deactivate product" : "Activate product"}
                        className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors disabled:opacity-50"
                      >
                        {product.isActive ? (
                          <XCircleIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        aria-label="Delete product"
                        title="Delete product"
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
