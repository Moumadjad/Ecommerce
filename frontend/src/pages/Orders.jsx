import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";

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
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">My orders</h1>

      {error && <p className="text-red-600">{error}</p>}
      {orders === null && !error && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {orders?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No orders yet.{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Browse products
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 hover:shadow-sm"
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
