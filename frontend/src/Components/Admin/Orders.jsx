import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const STATUS_OPTIONS = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = res.ok ? await res.json() : [];
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      // adjust URL/Body as per backend
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        alert("Status update failed");
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout title="Orders Management">
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 overflow-x-auto">
        <table className="w-full text-sm text-slate-200">
          <thead>
            <tr className="border-b border-slate-600 text-left">
              <th className="p-2">Order</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Placed On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-slate-700">
                <td className="p-2">#{o._id?.slice(-6)}</td>
                <td>{o.user?.email || o.userId}</td>
                <td>{o.items?.length || 0}</td>
                <td>₹{o.totalAmount || o.total || 0}</td>
                <td>{(o.createdAt || "").slice(0, 10)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <select
                      className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs"
                      value={o.status || "Pending"}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      disabled={updatingId === o._id}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {updatingId === o._id && (
                      <span className="text-[10px] text-slate-400">
                        updating...
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-slate-400 text-xs"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
