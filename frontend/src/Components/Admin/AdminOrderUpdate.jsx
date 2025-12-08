import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AdminOrderUpdate() {
  const { id } = useParams(); // order ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const statuses = [
    "PENDING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      setLoading(true);
      const res = await API.get(`/admin/orders/${id}`);
      setOrder(res.data.order);
      setNewStatus(res.data.order.status);
    } catch (err) {
      console.error(err);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    try {
      setSaving(true);
      await API.put(`/admin/orders/${id}`, { status: newStatus });

      alert("Order Status Updated!");
      navigate("/admin/orders");

    } catch (err) {
      console.error(err);
      alert("Failed to update order!");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <AdminLayout title="Update Order">
        <div className="p-6 text-white">Loading Order...</div>
      </AdminLayout>
    );

  if (!order)
    return (
      <AdminLayout title="Update Order">
        <div className="p-6 text-red-400">Order Not Found!</div>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Update Order Status">

      <div className="max-w-3xl mx-auto p-4 space-y-6">

        <h1 className="text-2xl font-bold text-white">
          Update Order Status — #{order._id}
        </h1>

        {/* --------------- ORDER SUMMARY --------------- */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">

          <h2 className="text-lg font-semibold text-white mb-3">Order Details</h2>

          <p className="text-slate-300">
            <span className="font-semibold">User:</span>{" "}
            {order.user?.name} ({order.user?.email})
          </p>

          <p className="text-slate-300 mt-1">
            <span className="font-semibold">Items:</span>{" "}
            {order.items.length}
          </p>

          <p className="text-slate-300 mt-1">
            <span className="font-semibold">Amount:</span>{" "}
            ₹
            {order.items.reduce((s, i) => s + i.price * i.quantity, 0)}
          </p>

          <p className="text-slate-300 mt-1">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <p className="text-slate-300 mt-1">
            <span className="font-semibold">Current Status:</span>{" "}
            <span className="text-lime-400 font-semibold">{order.status}</span>
          </p>

        </div>

        {/* --------------- UPDATE STATUS FORM --------------- */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">

          <h2 className="text-lg font-semibold text-white mb-3">Change Status</h2>

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="bg-slate-700 text-white p-3 rounded w-full border border-slate-600"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* UPDATE BUTTON */}
          <button
            onClick={updateStatus}
            disabled={saving}
            className="bg-lime-500 mt-4 text-black font-bold px-5 py-2 rounded hover:bg-lime-400 disabled:bg-gray-500"
          >
            {saving ? "Saving..." : "Update Status"}
          </button>

        </div>

      </div>

    </AdminLayout>
  );
}
