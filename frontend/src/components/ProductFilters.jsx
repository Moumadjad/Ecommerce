import { useEffect, useState } from "react";
import { input } from "../lib/ui";

const CHECKBOX_CLASS =
  "h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-indigo-600 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 cursor-pointer";

export default function ProductFilters({
  categories,
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  inStock,
  onInStockChange,
  onClear,
}) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => setLocalMin(minPrice), [minPrice]);
  useEffect(() => setLocalMax(maxPrice), [maxPrice]);

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
    selectedCategories.length > 0 || minPrice || maxPrice || inStock;

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
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
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
