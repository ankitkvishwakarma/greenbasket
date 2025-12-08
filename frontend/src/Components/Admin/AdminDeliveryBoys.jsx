import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AdminDeliveryBoys() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadDeliveryBoys();
  }, []);

  async function loadDeliveryBoys() {
    try {
      setLoading(true);
      const res = await API.get("/admin/delivery/all");
      setDeliveryBoys(res.data.deliveryBoys || []);
    } catch (err) {
      setError("Failed to load delivery boys");
    } finally {
      setLoading(false);
    }
  }

  // Add Delivery Boy
  async function addDeliveryBoy(e) {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Name and Phone are required!");
      return;
    }

    try {
      const res = await API.post("/admin/delivery/create", { name, phone });
      alert("Delivery Boy Added Successfully!");

      setName("");
      setPhone("");

      loadDeliveryBoys();
    } catch (err) {
      console.error(err);
      alert("Failed to add delivery boy");
    }
  }

  return (
    <AdminLayout title="Delivery Boys">
      <div className="max-w-6xl mx-auto p-4 space-y-6">

        {/* --------------- HEADER --------------- */}
        <h1 className="text-2xl font-bold text-white">Delivery Boy Management</h1>

        {/* --------------- ERROR MESSAGE --------------- */}
        {error && (
          <div className="bg-red-600/20 border border-red-700 text-red-300 p-3 rounded">
            {error}
          </div>
        )}

        {/* --------------- ADD DELIVERY BOY FORM --------------- */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
          <h2 className="text-xl text-white font-semibold mb-3">Add New Delivery Boy</h2>

          <form onSubmit={addDeliveryBoy} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-700 text-white p-3 rounded border border-slate-600"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-700 text-white p-3 rounded border border-slate-600"
            />

            <button
              type="submit"
              className="bg-lime-500 text-black font-bold p-3 rounded hover:bg-lime-400"
            >
              + Add Delivery Boy
            </button>
          </form>
        </div>

        {/* --------------- DELIVERY BOY LIST --------------- */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
          <h2 className="text-xl text-white font-semibold mb-3">All Delivery Boys</h2>

          {loading ? (
            <div className="text-white">Loading...</div>
          ) : deliveryBoys.length === 0 ? (
            <p className="text-slate-400 text-center">No Delivery Boys Found</p>
          ) : (
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Assigned Orders</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {deliveryBoys.map((boy) => (
                  <tr
                    key={boy._id}
                    className="border-b border-slate-700 hover:bg-slate-700/40"
                  >
                    <td className="p-2">{boy.name}</td>
                    <td className="p-2">{boy.phone}</td>

                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold
                          ${
                            boy.status === "ONLINE"
                              ? "bg-green-600/30 text-green-400"
                              : boy.status === "BUSY"
                              ? "bg-yellow-600/30 text-yellow-300"
                              : "bg-red-600/30 text-red-300"
                          }`}
                      >
                        {boy.status}
                      </span>
                    </td>

                    <td className="p-2 text-center">
                      {boy.assignedOrders?.length || 0}
                    </td>

                    <td className="p-2">
                      <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
