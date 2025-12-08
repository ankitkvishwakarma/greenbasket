import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      setLoading(true);
      const res = await API.get(`/admin/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
      alert("Failed to load order details");
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

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="p-6 text-white">Loading...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="p-6 text-red-400">Order Not Found!</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Details">
      <div className="max-w-5xl mx-auto p-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Order Details — #{order._id}
          </h1>

          <div className="space-x-3">

            <Link
              to={`/admin/orders/update/${order._id}`}
              className="bg-purple-500 px-4 py-2 rounded text-white hover:bg-purple-400"
            >
              Update Status
            </Link>

            <Link
              to={`/admin/delivery/assign/${order._id}`}
              className="bg-yellow-500 px-4 py-2 rounded text-black hover:bg-yellow-400"
            >
              Assign Delivery
            </Link>

          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>

          <p className="text-slate-300">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Amount:</span>{" "}
            ₹
            {order.items.reduce((s, i) => s + i.price * i.quantity, 0)}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Payment:</span>{" "}
            <span className="text-green-400">{order.paymentStatus}</span>
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Current Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded font-semibold ${statusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </p>
        </div>

        {/* USER DETAILS */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
          <h2 className="text-xl font-semibold text-white">Customer Details</h2>

          <p className="text-slate-300">
            <span className="font-semibold">Name:</span> {order.user?.name}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Email:</span> {order.user?.email}
          </p>

          <p className="text-slate-300">
            <span className="font-semibold">Phone:</span> {order.phone}
          </p>
        </div>

        {/* ADDRESS */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Delivery Address
          </h2>

          <p className="text-slate-300 leading-relaxed">
            {order.address?.name}, {order.address?.phone}
            <br />
            {order.address?.street}
            <br />
            {order.address?.city}, {order.address?.state} —{" "}
            {order.address?.pincode}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3">Items</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-b border-slate-700 pb-3"
              >
                <img
                  src={item.product?.image || "/no-image.png"}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {item.product?.name}
                  </p>
                  <p className="text-slate-400 text-sm">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="text-green-400 font-bold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER TIMELINE */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Order Timeline
          </h2>

          <ul className="space-y-3">
            {order.timeline?.map((step) => (
              <li key={step._id} className="text-slate-300">
                <span className="text-lime-400 font-semibold">
                  {step.status}
                </span>{" "}
                — {new Date(step.time).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </AdminLayout>
  );
}
