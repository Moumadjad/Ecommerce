import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { formatCurrency } from "../lib/currency";
import { btn, card, link } from "../lib/ui";

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
        <Link to="/orders" className={link()}>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Order {order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className={card("divide-y divide-gray-200 dark:divide-gray-800 px-5")}>
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between py-2.5 text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {item.name} x {item.quantity}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-semibold text-gray-900 dark:text-white">
        Total: {formatCurrency(order.totalPrice)}
      </p>

      {order.shippingAddress?.address && (
        <div className="mt-5 text-sm text-gray-600 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-white">Shipping to</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}

      {payError && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
          {payError}
        </p>
      )}

      {order.status === "pending" && !confirming && (
        <button type="button" onClick={() => setConfirming(true)} className={btn("primary", "lg", "mt-6")}>
          Pay now
        </button>
      )}

      {order.status === "pending" && confirming && (
        <div className={card("mt-6 p-4")}>
          <p className="text-gray-900 dark:text-gray-100">
            Confirm payment of <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Simulated payment — no card details required, this always succeeds.
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={handlePay} disabled={paying} className={btn("primary")}>
              {paying ? "Processing..." : "Confirm payment"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={paying}
              className={btn("secondary")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {order.status === "paid" && (
        <p className="mt-6 text-sm text-green-600 dark:text-green-400">
          Payment confirmed{order.paidAt ? ` on ${new Date(order.paidAt).toLocaleString()}` : ""}.
        </p>
      )}
    </div>
  );
}
