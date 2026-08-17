import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { formatCurrency } from "../../lib/currency";
import { card, link } from "../../lib/ui";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError("Order not found"));
  }, [id]);

  async function handleStatusChange(status) {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrder((prev) => ({ ...prev, status: data.order.status }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <Link to="/admin/orders" className={link()}>
          Back to orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <Link to="/admin/orders" className={`${link()} text-sm`}>
        ← Back to orders
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {order.orderNumber}
        </h1>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-2 py-1 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={card("p-5 mb-6")}>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">
          Customer
        </h2>
        <p className="text-gray-900 dark:text-gray-100">{order.user?.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email}</p>
        {order.user?._id && (
          <Link
            to={`/admin/orders?user=${order.user._id}&customerName=${encodeURIComponent(order.user.name)}`}
            className={`${link()} text-sm inline-block mt-2`}
          >
            View all orders from this customer
          </Link>
        )}
      </div>

      <div className={card("divide-y divide-gray-200 dark:divide-gray-800 px-5")}>
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center gap-3 py-3 text-sm">
            {item.image && (
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
            )}
            <span className="flex-1 text-gray-700 dark:text-gray-300">
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
        <div className={card("mt-6 p-5")}>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">
            Shipping address
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress.address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress.country}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
        {order.paidAt && <p>Paid: {new Date(order.paidAt).toLocaleString()}</p>}
      </div>
    </div>
  );
}
