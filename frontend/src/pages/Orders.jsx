import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { card, link } from "../lib/ui";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError("Failed to load orders"));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        My orders
      </h1>

      {error && <p className="text-red-600">{error}</p>}
      {orders === null && !error && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {orders?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No orders yet.{" "}
          <Link to="/" className={link()}>
            Browse products
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className={card("flex items-center justify-between px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all")}
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {order.items.length} item{order.items.length > 1 ? "s" : ""} — $
                {order.totalPrice.toFixed(2)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
