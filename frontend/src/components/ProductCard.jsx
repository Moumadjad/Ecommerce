import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { card } from "../lib/ui";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product._id);

  return (
    <div
      className={card(
        "group relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
      )}
    >
      <Link
        to={`/products/${product._id}`}
        aria-label={product.name}
        className="absolute inset-0 z-0"
      />

      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        title={favorited ? "Remove from favorites" : "Add to favorites"}
        className="pointer-events-auto absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${favorited ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          <path d="M12 21s-6.7-4.3-9.3-8.1C1 10.2 1.6 6.6 4.6 5.1c2.3-1.1 4.7-.3 6.1 1.6l1.3 1.7 1.3-1.7c1.4-1.9 3.8-2.7 6.1-1.6 3 1.5 3.6 5.1 1.9 7.8C18.7 16.7 12 21 12 21Z" />
        </svg>
      </button>

      <div className="pointer-events-none aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="pointer-events-none p-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="mt-1 font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </p>
          {product.stock === 0 ? (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Out of stock</span>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              aria-label="Add to cart"
              title="Add to cart"
              className="pointer-events-auto relative z-10 h-8 w-8 rounded-lg bg-amber-700 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shrink-0"
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
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
