import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
          ${product.price.toFixed(2)}
        </p>
        {product.stock === 0 && (
          <p className="text-sm text-red-600 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
