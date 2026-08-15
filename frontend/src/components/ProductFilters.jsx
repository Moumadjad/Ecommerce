import { useEffect, useState } from "react";
import { btn, input } from "../lib/ui";

const CHECKBOX_CLASS =
  "h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-amber-700 focus:ring-1 focus:ring-amber-600 dark:bg-gray-800 cursor-pointer";

export const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
];

export default function ProductFilters({
  search,
  onSearchChange,
  categories,
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  inStock,
  onInStockChange,
  sort,
  onSortChange,
  onClear,
}) {
  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => setLocalSearch(search), [search]);
  useEffect(() => setLocalMin(minPrice), [minPrice]);
  useEffect(() => setLocalMax(maxPrice), [maxPrice]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = localSearch.trim();
      if (trimmed !== search) {
        onSearchChange(trimmed);
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localMin !== minPrice || localMax !== maxPrice) {
        onPriceChange(localMin, localMax);
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localMin, localMax]);

  const hasActiveFilters =
    search || selectedCategories.length > 0 || minPrice || maxPrice || inStock;

  return (
    <aside className="w-full sm:w-56 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className={input(localSearch ? "pr-9 text-sm" : "text-sm")}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch("")}
              aria-label="Clear search"
              className={btn(
                "ghost",
                "sm",
                "absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-md"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Sort by
          </h3>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className={input("py-1.5 text-sm")}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {categories.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Category
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 capitalize cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => onToggleCategory(cat)}
                    className={CHECKBOX_CLASS}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Price
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className={input("px-2 py-1.5 text-sm")}
              />
            </div>
            <span className="text-gray-400 shrink-0">–</span>
            <div className="flex-1 min-w-0">
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className={input("px-2 py-1.5 text-sm")}
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className={CHECKBOX_CLASS}
          />
          In stock only
        </label>
      </div>
    </aside>
  );
}
