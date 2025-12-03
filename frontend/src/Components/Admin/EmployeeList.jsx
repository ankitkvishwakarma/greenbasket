import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const res = await API.get("/delivery/all");
      setEmployees(res.data.deliveryBoys || []);
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = employees.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "ALL" || e.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="Employee Management">
      <div className="p-4 space-y-4">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <input
            placeholder="Search employee..."
            className="bg-slate-800 px-3 py-2 rounded border border-slate-700 text-white"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="bg-slate-800 px-3 py-2 rounded border border-slate-700 text-white"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="BUSY">Busy</option>
          </select>
        </div>

        {/* Employee Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {filtered.map((e) => (
            <div
              key={e._id}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow"
            >
              <div className="flex items-center gap-3">

                <img
                  src={e.avatar || "/default-user.png"}
                  className="w-14 h-14 rounded-full object-cover border border-slate-600"
                />

                <div>
                  <h3 className="text-white font-semibold">{e.name}</h3>
                  <p className="text-slate-400 text-sm">{e.phone}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    e.status === "ONLINE"
                      ? "bg-green-600/20 text-green-400"
                      : e.status === "BUSY"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {e.status}
                </span>
              </div>

              {/* Extra Info */}
              <div className="text-slate-300 text-sm mt-2">
                <p>Orders Completed: {e.deliveries || 0}</p>
                <p>Last Online: {e.lastOnline || "—"}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-lime-500 hover:bg-lime-400 text-black px-3 py-2 rounded">
                  Assign Order
                </button>

                <button className="flex-1 bg-blue-500 hover:bg-blue-400 text-black px-3 py-2 rounded">
                  Track
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
