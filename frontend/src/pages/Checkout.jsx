import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ address: "", city: "", postalCode: "", country: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((item) => ({ product: item.productId, quantity: item.quantity })),
        shippingAddress: address,
      });
      clearCart();
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div>
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
    <div className="grid sm:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Shipping address</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded px-3 py-2">{error}</p>
        )}

        {["address", "city", "postalCode", "country"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              required
              value={address[field]}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Order summary</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name} x {item.quantity}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
          Total: ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
