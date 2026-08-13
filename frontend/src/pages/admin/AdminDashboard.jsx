import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => setError("Failed to load dashboard stats"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Products" value={stats.totalProducts} />
        <StatCard label="Users" value={stats.totalUsers} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Orders by status
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.ordersByStatus).length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
          )}
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div
              key={status}
              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
            >
              <OrderStatusBadge status={status} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Low stock products
        </h2>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No low-stock products.</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.lowStockProducts.map((product) => (
              <Link
                key={product._id}
                to={`/admin/products/${product._id}/edit`}
                className="flex justify-between py-2 text-sm hover:text-indigo-600"
              >
                <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
                <span className="text-red-600">{product.stock} left</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Recent orders
        </h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center justify-between py-2 text-sm hover:text-indigo-600"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {order.user?.name} — ${order.totalPrice.toFixed(2)}
                </span>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
