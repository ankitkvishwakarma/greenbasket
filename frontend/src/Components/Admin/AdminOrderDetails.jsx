import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  useEffect(() => {
    loadOrder();
    loadDeliveryBoys();
  }, []);

  async function loadOrder() {
    try {
      const res = await API.get(`/orders/admin/all`);
      const found = res.data.orders.find((o) => o._id === id);
      setOrder(found || null);
    } catch (err) {
      alert("Failed to load order details");
    }
  }

  async function loadDeliveryBoys() {
    const res = await API.get("/user/delivery-boys");
    setDeliveryBoys(res.data.deliveryBoys || []);
  }

  async function assign(id, deliveryBoyId) {
    await API.put(`/orders/admin/${id}/assign`, { deliveryBoyId });
    loadOrder();
  }

  if (!order) return <AdminLayout title="Order Details">Loading...</AdminLayout>;

  return (
    <AdminLayout title="Order Details">
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-3">Order #{order._id}</h2>
        <p className="text-gray-300"><strong>Customer:</strong> {order.userId?.name}</p>
        <p className="text-gray-300"><strong>Status:</strong> {order.status}</p>
        <p className="text-gray-300"><strong>Total:</strong> ₹{order.totalAmount}</p>

        <h3 className="text-lg text-white mt-5 mb-2 font-semibold">Items</h3>
        {order.items.map((i) => (
          <p key={i._id} className="text-gray-300">
            {i.productId?.name} — {i.quantity} × ₹{i.price}
          </p>
        ))}

        <select
          className="mt-4 p-2 bg-slate-800 text-white rounded"
          onChange={(e) => assign(order._id, e.target.value)}
        >
          <option>Assign Delivery Boy</option>
          {deliveryBoys.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>
    </AdminLayout>
  );
}
