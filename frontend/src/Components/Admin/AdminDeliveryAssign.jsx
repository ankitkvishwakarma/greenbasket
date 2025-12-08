// src/Components/Admin/AdminDeliveryAssign.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AdminDeliveryAssign() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [deliveryBoyId, setDeliveryBoyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [orderRes, boysRes] = await Promise.all([
        API.get(`/admin/orders/${orderId}`),
        API.get("/admin/delivery/all"),
      ]);

      setOrder(orderRes.data.order);
      setDeliveryBoys(boysRes.data.deliveryBoys || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    if (!deliveryBoyId) {
      alert("Please select a delivery boy");
      return;
    }

    try {
      setSaving(true);
      await API.post(`/admin/assign/${orderId}`, { deliveryBoyId });
      alert("Delivery boy assigned successfully");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to assign delivery boy");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Assign Delivery">
        <div className="p-6 text-white">Loading...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Assign Delivery">
        <div className="p-6 text-red-400">Order not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Assign Delivery">
      <div className="max-w-3xl mx-auto p-4 space-y-6">

        <h1 className="text-2xl font-bold text-white">
          Assign Delivery — #{order._id}
        </h1>

        {/* ORDER SUMMARY */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2">
          <p className="text-slate-300">
            <span className="font-semibold">Customer:</span>{" "}
            {order.user?.name} ({order.user?.email})
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Amount:</span>{" "}
            ₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0)}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Current Status:</span>{" "}
            {order.status}
          </p>
        </div>

        {/* SELECT DELIVERY BOY */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Select Delivery Boy
          </h2>

          <select
            value={deliveryBoyId}
            onChange={(e) => setDeliveryBoyId(e.target.value)}
            className="bg-slate-700 text-white p-3 rounded w-full border border-slate-600"
          >
            <option value="">-- Select Delivery Boy --</option>
            {deliveryBoys.map((boy) => (
              <option key={boy._id} value={boy._id}>
                {boy.name} ({boy.phone}){" "}
                {boy.status === "BUSY" ? "- BUSY" : ""}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssign}
            disabled={saving}
            className="bg-lime-500 mt-3 text-black font-bold px-5 py-2 rounded hover:bg-lime-400 disabled:bg-gray-500"
          >
            {saving ? "Assigning..." : "Assign Delivery Boy"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
