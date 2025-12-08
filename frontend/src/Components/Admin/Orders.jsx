import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const res = await API.get("/admin/orders");
    setOrders(res.data.orders || []);
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
              <tr
                key={o._id}
                className="border-b border-white/10 hover:bg-white/5 text-sm"
              >
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.userId?.name || "Customer"}</td>
                <td className="p-3 font-semibold text-lime-300">
                  ₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0)}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs border 
                    ${o.status === "DELIVERED"
                        ? "text-lime-400 border-lime-400/30 bg-lime-400/10"
                        : o.status === "PENDING"
                          ? "text-yellow-300 border-yellow-300/30 bg-yellow-300/10"
                          : "text-blue-300 border-blue-300/30 bg-blue-300/10"
                      }`}
                  >
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

      {/* MOBILE VIEW (Collapsible Cards) */}
      <div className="lg:hidden mt-5 space-y-3">
        {orders.map((o) => (
          <div
            key={o._id}
            className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <p className="text-slate-300 text-sm">{o._id}</p>

            <p className="text-white text-lg font-bold">
              ₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0)}
            </p>

            <p className="text-slate-400 text-sm">{o.userId?.name}</p>

            <Link
              to={`/admin/orders/${o._id}`}
              className="block mt-2 text-blue-300 underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}
