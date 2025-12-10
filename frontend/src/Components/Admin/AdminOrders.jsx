import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  useEffect(() => {
    loadOrders();
    loadDeliveryBoys();
  }, []);

  async function loadOrders() {
    const res = await API.get("/orders/admin/all");
    setOrders(res.data.orders || []);
  }

  async function loadDeliveryBoys() {
    const res = await API.get("/user/delivery-boys");
    setDeliveryBoys(res.data.deliveryBoys || []);
  }

  async function assign(orderId, deliveryBoyId) {
    await API.put(`/orders/admin/${orderId}/assign`, { deliveryBoyId });
    loadOrders();
  }

  return (
    <div className="p-5 text-white">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.map((o) => (
        <div key={o._id} className="p-4 bg-slate-900 rounded-xl mb-4">

          <p><b>Order ID:</b> {o._id}</p>
          <p><b>User:</b> {o.userId?.name}</p>
          <p><b>Status:</b> {o.status}</p>
          <p><b>Total:</b> ₹{o.totalAmount}</p>

          <div className="mt-2">
            <b>Items:</b>
            {o.items.map((i) => (
              <p key={i._id}>
                {i.productId?.name} — {i.quantity} × ₹{i.price}
              </p>
            ))}
          </div>

          <select
            className="mt-3 bg-slate-800 p-2 rounded"
            onChange={(e) => assign(o._id, e.target.value)}
          >
            <option>Select Delivery Boy</option>
            {deliveryBoys.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

        </div>
      ))}
    </div>
  );
}
