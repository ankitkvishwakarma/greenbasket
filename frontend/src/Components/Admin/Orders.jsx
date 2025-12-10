// src/Components/Admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await API.get("/orders/admin/all");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout title="Orders List">
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full min-w-[650px]">
          <thead className="bg-white/10">
            <tr className="text-left text-sm text-slate-300">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.userId?.name}</td>
                <td className="p-3 text-lime-300 font-semibold">₹{o.totalAmount}</td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs border 
                    ${
                      o.status === "DELIVERED"
                        ? "text-lime-400 border-lime-400/30 bg-lime-400/10"
                        : "text-yellow-300 border-yellow-300/30 bg-yellow-300/10"
                    }`}>
                    {o.status}
                  </span>
                </td>

                <td className="p-3">
                  <Link
                    to={`/admin/orders/${o._id}`}
                    className="text-blue-300 underline hover:text-blue-200"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
