import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { EyeIcon, SearchIcon, XCircleIcon } from "../../components/icons";
import { formatCurrency } from "../../lib/currency";
import { btn, card, input } from "../../lib/ui";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAGE_SIZES = [10, 20, 50, 100];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userFilter = searchParams.get("user") || "";
  const customerName = searchParams.get("customerName") || "";

  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== search) {
        setPage(1);
        setSearch(trimmed);
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function load() {
    api
      .get("/orders", {
        params: { page, limit, search: search || undefined, user: userFilter || undefined },
      })
      .then(({ data }) => {
        setOrders(data.orders);
        setPages(data.pages);
      })
      .catch(() => setError("Failed to load orders"));
  }

  useEffect(load, [page, limit, search, userFilter]);

  function clearUserFilter() {
    setSearchParams({});
  }

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
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
        Orders
      </h1>

      {userFilter && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Filtered by customer{customerName ? `: ${customerName}` : ""}
          </span>
          <button
            type="button"
            onClick={clearUserFilter}
            aria-label="Clear customer filter"
            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <XCircleIcon className="h-4 w-4" />
            Clear
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by customer name or email..."
            className={input("pl-9")}
          />
        </div>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className={input("sm:w-40")}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {orders === null && !error && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {orders?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No orders found.</p>}

      {orders?.length > 0 && (
        <div className={card("overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pl-5 pr-4 font-medium">Order #</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 pl-5 pr-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 pr-4 text-gray-900 dark:text-gray-100">
                    {order.user?.name}
                    <br />
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{order.user?.email}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs px-2 py-1 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      aria-label="View order"
                      title="View order"
                      className="inline-flex text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={btn("secondary", "sm", "disabled:opacity-40")}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className={btn("secondary", "sm", "disabled:opacity-40")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
