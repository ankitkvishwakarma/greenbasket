// src/Components/Admin/RatingsSalary.jsx
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RatingsSalary(){
  const { id } = useParams();
  const [summary,setSummary] = useState(null);

  useEffect(()=>{
    // TODO: fetch summary from /api/delivery/{id}/summary
    setSummary({
      id,
      totalDeliveries: 124,
      monthDeliveries: 22,
      pendingPayout: 4800,
      rating: 4.7
    });
  },[id]);

  if(!summary) return <AdminLayout title="Loading..."><div /></AdminLayout>;

  return (
    <AdminLayout title={`Payout & Ratings — ${id}`}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold">Earnings</h3>
          <p className="text-slate-400 mt-2">Pending Payout</p>
          <div className="text-2xl font-bold text-white mt-2">₹{summary.pendingPayout}</div>

          <div className="mt-4">
            <button onClick={()=>alert("Payout processed (mock)")} className="px-4 py-2 bg-indigo-600 rounded-md">Process Payout</button>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold">Rating</h3>
          <div className="text-xl text-white mt-2">{summary.rating} ⭐</div>
          <p className="text-slate-400 mt-3">Deliveries this month: {summary.monthDeliveries}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
