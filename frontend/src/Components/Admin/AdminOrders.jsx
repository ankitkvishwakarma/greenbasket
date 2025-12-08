import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  function statusColor(status) {
    if (status === "PENDING") return "bg-yellow-600/30 text-yellow-300";
    if (status === "PACKED") return "bg-blue-600/30 text-blue-300";
    if (status === "SHIPPED") return "bg-indigo-600/30 text-indigo-300";
    if (status === "OUT_FOR_DELIVERY") return "bg-purple-600/30 text-purple-300";
    if (status === "DELIVERED") return "bg-green-600/30 text-green-300";
    if (status === "CANCELLED") return "bg-red-600/30 text-red-300";
  }

  const filtered = orders.filter((o) =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Orders">
      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>

          <input
            type="text"
            placeholder="Search Order / User / Status"
            className="bg-slate-800 text-white p-3 rounded border border-slate-600 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-600/20 border border-red-700 text-red-300 p-3 rounded">
            {error}
          </div>
        )}

        {/* ORDER TABLE */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg overflow-x-auto">
          {loading ? (
            <p className="text-white text-center">Loading orders...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400 text-center">No orders found</p>
          ) : (
            <table className="w-full text-left text-white min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-slate-700 hover:bg-slate-700/40"
                  >
                    <td className="p-3 text-lime-300">{order._id}</td>

                    <td className="p-3">
                      {order.user?.name || "Unknown"}
                      <br />
                      <span className="text-slate-400 text-sm">
                        {order.user?.email}
                      </span>
                    </td>

                    <td className="p-3">{order.items.length}</td>

                    <td className="p-3 font-bold text-green-400">
                      ₹
                      {order.items.reduce(
                        (s, i) => s + i.price * i.quantity,
                        0
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    <td className="p-3 space-x-3">

                      {/* VIEW DETAILS */}
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-400 text-sm"
                      >
                        View
                      </Link>

                      {/* ASSIGN DELIVERY */}
                      <Link
                        to={`/admin/delivery/assign/${order._id}`}
                        className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-400 text-sm"
                      >
                        Assign
                      </Link>

                      {/* UPDATE STATUS */}
                      <Link
                        to={`/admin/orders/update/${order._id}`}
                        className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-400 text-sm"
                      >
                        Update
                      </Link>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
