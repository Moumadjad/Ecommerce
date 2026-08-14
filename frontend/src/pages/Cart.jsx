import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { btn, card, input, link } from "../lib/ui";

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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
          Your cart
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your cart is empty.{" "}
          <Link to="/" className={link()}>
            Browse products
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        Your cart
      </h1>

      <div className={card("divide-y divide-gray-200 dark:divide-gray-800 px-5")}>
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
            </div>
            <div className="w-16 shrink-0">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || 1)}
                className={input()}
              />
            </div>
            <p className="w-20 text-right font-medium text-gray-900 dark:text-gray-100">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeFromCart(item.productId)}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <button type="button" onClick={handleCheckout} className={btn("primary", "lg")}>
          Checkout
        </button>
      </div>
    </div>
  );
}
