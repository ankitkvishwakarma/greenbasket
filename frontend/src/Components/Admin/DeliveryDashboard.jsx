import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadMyOrders();
  }, []);

  async function loadMyOrders() {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  }

  return (
    <div>
      <h2>My Assigned Orders</h2>

      {orders.map((o) => (
        <div key={o._id}>
          <p>Order: {o._id}</p>
          <p>Status: {o.status}</p>
        </div>
      ))}
    </div>
  );
}
