import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import { btn, input } from "../lib/ui";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = { page };
    if (search) params.search = search;
    if (category) params.category = category;

    api
      .get("/products", { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, search, category]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearch(e.target.search.value.trim());
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Products
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Browse the full catalog.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 mb-8">
        <input type="text" name="search" placeholder="Search products..." className={input("flex-1 min-w-[200px]")} />
        <input
          type="text"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          placeholder="Filter by category..."
          className={input("sm:w-56")}
        />
        <button type="submit" className={btn("primary")}>
          Search
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

      {!loading && products.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
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
