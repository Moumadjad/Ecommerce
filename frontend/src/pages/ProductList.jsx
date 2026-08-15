import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { btn } from "../lib/ui";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("-createdAt");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products/categories")
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = { page, sort };
    if (search) params.search = search;
    if (selectedCategories.length > 0) params.category = selectedCategories.join(",");
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (inStock) params.inStock = "true";

    api
      .get("/products", { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, sort, search, selectedCategories, minPrice, maxPrice, inStock]);

  function handleSearchChange(value) {
    setPage(1);
    setSearch(value);
  }

  function toggleCategory(cat) {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handlePriceChange(min, max) {
    setPage(1);
    setMinPrice(min);
    setMaxPrice(max);
  }

  function handleInStockChange(checked) {
    setPage(1);
    setInStock(checked);
  }

  function handleSortChange(value) {
    setPage(1);
    setSort(value);
  }

  function handleClearFilters() {
    setPage(1);
    setSearch("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Products
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse the full catalog.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <ProductFilters
          search={search}
          onSearchChange={handleSearchChange}
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          inStock={inStock}
          onInStockChange={handleInStockChange}
          sort={sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
        />

        <div className="flex-1 min-w-0 w-full">
          {error && <p className="text-red-600">{error}</p>}
          {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

          {!loading && products.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No products found.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
      </div>
    </div>
  );
}
