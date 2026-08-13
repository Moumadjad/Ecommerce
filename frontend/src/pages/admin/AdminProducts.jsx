import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Products</h2>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          New product
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{product.name}</td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-300 capitalize">
                    {product.category}
                  </td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                  <td className="py-2 pr-4 text-right space-x-3">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
            className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-gray-700 dark:text-gray-200 disabled:opacity-40"
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
            className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-gray-700 dark:text-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
