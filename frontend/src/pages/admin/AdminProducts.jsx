import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { btn, card } from "../../lib/ui";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/products", { params: { page, limit: 20 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [page]);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Products
        </h1>
        <Link to="/admin/products/new" className={btn("primary")}>
          New product
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

      {!loading && (
        <div className={card("overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Stock</th>
                <th className="py-3 pr-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pl-5 pr-4 text-gray-900 dark:text-gray-100">{product.name}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 capitalize">
                    {product.category}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                  <td className="py-3 pr-5 text-right space-x-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      aria-label="Delete product"
                      title="Delete product"
                      className="inline-flex align-middle text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7h14ZM10 11v6M14 11v6" />
                      </svg>
                    </button>
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
