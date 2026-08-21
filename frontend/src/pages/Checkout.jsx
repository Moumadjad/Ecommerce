import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/currency";
import { btn, card, input, label as labelClass, link } from "../lib/ui";

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
      const { data } = await api.post("/orders", { shippingAddress: address });
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
          <Link to="/" className={link()}>
            Browse products
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Shipping address
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {["address", "city", "postalCode", "country"].map((field) => (
          <div key={field}>
            <label className={`${labelClass()} capitalize`}>{field}</label>
            <input
              type="text"
              name={field}
              required
              value={address[field]}
              onChange={handleChange}
              className={input("mt-1")}
            />
          </div>
        ))}

        <button type="submit" disabled={submitting} className={btn("primary", "lg", "w-full")}>
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order summary</h2>
        <div className={card("divide-y divide-gray-200 dark:divide-gray-800 px-5")}>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-2.5 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name} x {item.quantity}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-semibold text-gray-900 dark:text-white">
          Total: {formatCurrency(totalPrice)}
        </p>
      </div>
    </div>
  );
}
