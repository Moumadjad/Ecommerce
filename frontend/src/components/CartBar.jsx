import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const MAX_THUMBS = 5;

export default function CartBar() {
  const { items, totalItems, totalPrice } = useCart();
  const location = useLocation();

  if (items.length === 0 || location.pathname === "/cart") return null;

  const shown = items.slice(0, MAX_THUMBS);
  const overflow = items.length - shown.length;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4 pointer-events-none">
      <Link
        to="/cart"
        className="pointer-events-auto mx-auto flex max-w-md items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg px-4 py-3 hover:shadow-xl transition-shadow"
      >
        <div className="flex -space-x-2 shrink-0">
          {shown.map((item) => (
            <div
              key={item.productId}
              className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 overflow-hidden"
            >
              {item.image && (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>
          ))}
          {overflow > 0 && (
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
              +{overflow}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">${totalPrice.toFixed(2)}</p>
        </div>

        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium">
          View cart
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
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
