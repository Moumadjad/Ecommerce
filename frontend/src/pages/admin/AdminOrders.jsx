import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  function load() {
    api
      .get("/orders")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError("Failed to load orders"));
  }

  useEffect(load, []);

  async function handleStatusChange(order, status) {
    setUpdatingId(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status } : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Orders</h2>

      {error && <p className="text-red-600">{error}</p>}
      {orders === null && !error && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {orders?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders?.map((order) => (
              <tr key={order._id}>
                <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">
                  {order.user?.name}
                  <br />
                  <span className="text-gray-500 dark:text-gray-400 text-xs">{order.user?.email}</span>
                </td>
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs px-2 py-1"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="py-2 pr-4 text-right">
                  <Link to={`/orders/${order._id}`} className="text-indigo-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
