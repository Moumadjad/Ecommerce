import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError("Order not found"));
  }, [id]);

  async function handlePay() {
    setPaying(true);
    setPayError("");
    try {
      const { data } = await api.post(`/orders/${id}/pay`);
      setOrder(data.order);
      setConfirming(false);
    } catch (err) {
      setPayError(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <Link to="/orders" className="text-indigo-600 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Order #{order._id.slice(-6)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 border-y border-gray-200 dark:border-gray-700">
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between py-2 text-sm">
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
        Total: ${order.totalPrice.toFixed(2)}
      </p>

      {order.shippingAddress?.address && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">Shipping to</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}

      {payError && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded px-3 py-2">
          {payError}
        </p>
      )}

      {order.status === "pending" && !confirming && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-6 rounded-md bg-indigo-600 text-white px-5 py-2.5 font-medium hover:bg-indigo-700"
        >
          Pay now
        </button>
      )}

      {order.status === "pending" && confirming && (
        <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-gray-900 dark:text-gray-100">
            Confirm payment of <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Simulated payment — no card details required, this always succeeds.
          </p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="rounded-md bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {paying ? "Processing..." : "Confirm payment"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={paying}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {order.status === "paid" && (
        <p className="mt-6 text-sm text-green-600">
          Payment confirmed{order.paidAt ? ` on ${new Date(order.paidAt).toLocaleString()}` : ""}.
        </p>
      )}
    </div>
  );
}
