import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  }

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your cart</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your cart is empty.{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Browse products
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your cart</h1>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || 1)}
              className="w-16 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-gray-900 dark:text-gray-100"
            />
            <p className="w-20 text-right font-medium text-gray-900 dark:text-gray-100">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeFromCart(item.productId)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={handleCheckout}
          className="rounded-md bg-indigo-600 text-white px-5 py-2.5 font-medium hover:bg-indigo-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
