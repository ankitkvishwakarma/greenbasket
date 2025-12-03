import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminSales() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalItems: 0,
    chart: [],
    topProducts: [],
  });

  useEffect(() => {
    // 🟢 Later → connect your API here
    setStats({
      totalSales: 125,
      totalRevenue: 45890,
      totalItems: 763,
      chart: [
        { day: "Mon", sales: 20 },
        { day: "Tue", sales: 35 },
        { day: "Wed", sales: 28 },
        { day: "Thu", sales: 50 },
        { day: "Fri", sales: 43 },
        { day: "Sat", sales: 80 },
        { day: "Sun", sales: 60 },
      ],
      topProducts: [
        { name: "Tomato", qty: 120 },
        { name: "Apple", qty: 98 },
        { name: "Potato", qty: 77 },
        { name: "Banana", qty: 65 },
      ],
    });
  }, []);

  return (
    <AdminLayout title="Sales Analytics">
      <div className="space-y-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">Total Orders</p>
            <h2 className="text-3xl font-bold text-white">{stats.totalSales}</h2>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">Revenue (₹)</p>
            <h2 className="text-3xl font-bold text-white">₹{stats.totalRevenue}</h2>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">Items Sold</p>
            <h2 className="text-3xl font-bold text-white">{stats.totalItems}</h2>
          </div>
        </div>

        {/* SALES GRAPH */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-4">Daily Sales</h3>

          <BarChart width={750} height={300} data={stats.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" />
            <Tooltip />
            <Bar dataKey="sales" fill="#A3E635" />
          </BarChart>
        </div>

        {/* TOP SELLING PRODUCTS */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-4">Top Selling Products</h3>

          <ul className="space-y-3">
            {stats.topProducts.map((p, i) => (
              <li
                key={i}
                className="flex justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-700"
              >
                <span className="text-slate-300">{p.name}</span>
                <span className="text-lime-400 font-semibold">{p.qty} sold</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </AdminLayout>
  );
}
