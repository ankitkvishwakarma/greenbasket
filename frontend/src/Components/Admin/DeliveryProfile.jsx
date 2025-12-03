// src/Components/Admin/DeliveryProfile.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function DeliveryProfile(){
  const { id } = useParams();
  const [boy, setBoy] = useState(null);

  useEffect(()=>{
    // TODO: replace with API call: /api/delivery/{id}
    setBoy({
      id,
      name: "Aman Singh",
      phone: "9876543210",
      status: "Online",
      assigned: 3,
      completed: 124,
      rating: 4.7,
      lastLocation: { lat: 28.6139, lng: 77.2090 },
    });
  },[id]);

  if(!boy) return <AdminLayout title="Delivery Boy"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title={`Delivery — ${boy.name}`}>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Basic info */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">{boy.name}</h3>
          <p className="text-slate-300">Phone: <b className="text-white">{boy.phone}</b></p>
          <p className="mt-2">
            Status: 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${boy.status==="Online" ? "bg-green-700" : "bg-red-700"}`}>
              {boy.status}
            </span>
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-slate-400 text-sm">Assigned Orders: <b className="text-white">{boy.assigned}</b></p>
            <p className="text-slate-400 text-sm">Completed: <b className="text-white">{boy.completed}</b></p>
            <p className="text-slate-400 text-sm">Rating: <b className="text-white">{boy.rating} ⭐</b></p>
          </div>

          <div className="mt-6 space-y-2">
            <Link to={`/admin/delivery/${id}/history`} className="block w-full text-center bg-blue-600 py-2 rounded-lg font-semibold">View History</Link>
            <Link to={`/admin/delivery/assign/${id}`} className="block w-full text-center bg-lime-500 py-2 rounded-lg font-semibold">Assign Orders</Link>
            <Link to={`/admin/delivery/${id}/map`} className="block w-full text-center border border-slate-700 py-2 rounded-lg font-semibold">Live Location</Link>
          </div>
        </div>

        {/* Middle: quick stats */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 col-span-2">
          <h4 className="text-white font-semibold mb-4">Performance Overview</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs">Completed</div>
              <div className="text-2xl font-bold text-white">{boy.completed}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs">Active Today</div>
              <div className="text-2xl font-bold text-white">{boy.assigned}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs">Rating</div>
              <div className="text-2xl font-bold text-white">{boy.rating} ⭐</div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-slate-400">Recent activity and quick actions.</p>
            {/* Could add buttons to call, message, or mark unavailable */}
            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 bg-amber-500 rounded-md text-black">Call</button>
              <button className="px-4 py-2 bg-indigo-600 rounded-md">Message</button>
              <button className="px-4 py-2 bg-red-600 rounded-md">Set Offline</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
