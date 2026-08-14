import { Link } from "react-router-dom";
import { card } from "../lib/ui";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className={card("group overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all")}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="mt-1 font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </p>
          {product.stock === 0 && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
