// src/Components/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      // ⭐ Correct products route
      const prodRes = await API.get("/products");

      // ⭐ Correct orders route (checkout orders)
      const orderRes = await API.get("/orders/admin/all");

      // ⭐ Correct delivery boys route
      let empRes = { data: { deliveryBoys: [] } };
      try {
        empRes = await API.get("/user/delivery-boys");
      } catch {}

      setProducts(prodRes?.data?.products || []);
      setOrders(orderRes?.data?.orders || []);
      setEmployees(empRes?.data?.deliveryBoys || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.items?.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p className="text-white text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <GlassCard
            title="Total Products"
            value={totalProducts}
            color="white"
            onClick={() => navigate("/admin/products")}
          />

          <GlassCard
            title="Total Stock"
            value={totalStock}
            color="lime"
            onClick={() => navigate("/admin/products")}
          />

          <GlassCard
            title="Low Stock"
            value={lowStock}
            color="red"
            onClick={() => navigate("/admin/products")}
          />

          <GlassCard
            title="Revenue"
            value={`₹${totalRevenue}`}
            color="cyan"
            onClick={() => navigate("/admin/sales")}
          />

          <GlassCard
            title="Total Orders"
            value={totalOrders}
            color="blue"
            onClick={() => navigate("/admin/orders")}
          />

          <GlassCard
            title="Delivered Orders"
            value={deliveredOrders}
            color="lime"
            onClick={() => navigate("/admin/orders")}
          />

          <GlassCard
            title="Pending Orders"
            value={pendingOrders}
            color="yellow"
            onClick={() => navigate("/admin/orders")}
          />

          <GlassCard
            title="Delivery Boys"
            value={employees.length}
            color="purple"
            onClick={() => navigate("/admin/delivery")}
          />

        </div>
      )}
    </AdminLayout>
  );
}

function GlassCard({ title, value, color, onClick }) {
  const colorMap = {
    white: "text-white",
    red: "text-red-400",
    yellow: "text-yellow-300",
    green: "text-green-400",
    blue: "text-blue-400",
    lime: "text-lime-400",
    cyan: "text-cyan-300",
    purple: "text-purple-400",
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 180 }}
      className="cursor-pointer p-5 rounded-2xl shadow-lg border border-white/20"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="text-slate-300 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-1 ${colorMap[color]}`}>
        {value}
      </h2>
    </motion.div>
  );
}
