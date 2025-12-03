import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      setError("");

      const prodRes = await API.get("/products");
      const orderRes = await API.get("/orders");
      const empRes = await API.get("/delivery/all");

      setProducts(prodRes?.data?.products || []);
      setOrders(orderRes?.data?.orders || []);
      setEmployees(empRes?.data?.deliveryBoys || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  // ================= INVENTORY ANALYTICS =================
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const totalStockValue = products.reduce(
    (s, p) => s + Number(p.price * p.stock || 0),
    0
  );
  const lowStock = products.filter((p) => p.stock < 10).length;

  const categoryStock = Object.entries(
    products.reduce((acc, p) => {
      const c = (p.category || "other").toLowerCase();
      acc[c] = (acc[c] || 0) + p.stock;
      return acc;
    }, {})
  ).map(([name, stock]) => ({ name, stock }));

  // ================= ORDER ANALYTICS =================
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

  const totalRevenue = orders.reduce(
    (sum, o) =>
      sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const todayOrders = orders.filter(
    (o) => o.createdAt.split("T")[0] === today
  ).length;

  const todaySales = orders
    .filter((o) => o.createdAt.split("T")[0] === today)
    .reduce(
      (sum, o) =>
        sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
      0
    );

  const last7days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const d = date.toISOString().split("T")[0];

    return {
      date: d.slice(5),
      count: orders.filter((o) => o.createdAt.split("T")[0] === d).length,
    };
  });

  // ================= EMPLOYEE ANALYTICS =================
  const totalEmployees = employees.length;
  const onlineEmployees = employees.filter((e) => e.status === "ONLINE").length;
  const offlineEmployees = employees.filter((e) => e.status === "OFFLINE").length;
  const busyEmployees = employees.filter((e) => e.status === "BUSY").length;

  const dutyPercent = totalEmployees
    ? Math.round(((onlineEmployees + busyEmployees) / totalEmployees) * 100)
    : 0;

  const availableEmployees = totalEmployees - busyEmployees;

  const loadBalanceScore =
    busyEmployees * 2 + onlineEmployees * 1 + offlineEmployees * 0;

  const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#ff8042", "#3BC9DB"];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Link
            to="/admin/add-product"
            className="bg-lime-500 px-4 py-2 rounded font-semibold hover:bg-lime-400"
          >
            + Add Product
          </Link>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-600/20 border border-red-700 text-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="text-white">Loading dashboard...</div>
        ) : (
          <>

            {/* ========== INVENTORY CARDS ========== */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              
              <Card title="Total Products" value={totalProducts} color="white" />
              <Card title="Total Stock" value={totalStock} color="white" />
              <Card title="Stock Value" value={`₹${totalStockValue}`} color="lime" />
              <Card title="Low Stock Items" value={lowStock} color="red" />

            </div>

            {/* ========== ORDER CARDS ========== */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              <Card title="Total Orders" value={totalOrders} color="blue" />
              <Card title="Pending Orders" value={pendingOrders} color="yellow" />
              <Card title="Delivered Orders" value={deliveredOrders} color="green" />
              <Card title="Cancelled Orders" value={cancelledOrders} color="red" />

            </div>

            {/* ========== SALES CARDS ========== */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              <Card title="Total Revenue" value={`₹${totalRevenue}`} color="lime" />
              <Card title="Orders Today" value={todayOrders} color="white" />
              <Card title="Today Sales" value={`₹${todaySales}`} color="lime" />

            </div>

            {/* ========== EMPLOYEE ANALYTICS ========== */}
            <h2 className="text-xl font-semibold text-white mt-6 mb-2">
              Employee Analytics
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              <Card title="Total Employees" value={totalEmployees} color="blue" />
              <Card title="Online" value={onlineEmployees} color="green" />
              <Card title="Offline" value={offlineEmployees} color="red" />
              <Card title="Busy" value={busyEmployees} color="yellow" />

            </div>

            {/* ADVANCED EMPLOYEE STATS */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">

              <Card title="On-Duty %" value={`${dutyPercent}%`} color="lime" />
              <Card title="Available Employees" value={availableEmployees} color="cyan" />
              <Card title="Load Balance Score" value={loadBalanceScore} color="purple" />

            </div>

            {/* ========== GRAPH SECTION ========== */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
              
              {/* Orders Last 7 Days */}
              <GraphCard title="Orders - Last 7 Days">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={last7days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </GraphCard>

              {/* Stock Pie Chart */}
              <GraphCard title="Stock Distribution by Category">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStock}
                      dataKey="stock"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label
                    >
                      {categoryStock.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </GraphCard>

            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

/* ------------------ SMALL REUSABLE CARD COMPONENT ------------------ */

function Card({ title, value, color }) {
  const colors = {
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
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold ${colors[color]}`}>{value}</h2>
    </div>
  );
}

/* ------------------ GRAPH WRAPPER ------------------ */

function GraphCard({ title, children }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="text-slate-200 font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
