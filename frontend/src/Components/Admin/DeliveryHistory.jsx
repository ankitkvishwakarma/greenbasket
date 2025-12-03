// src/Components/Admin/DeliveryHistory.jsx
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DeliveryHistory(){
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(()=>{
    // TODO: fetch(`/api/delivery/${id}/history`)
    setHistory([
      { orderId:"ORD1012", date:"2025-11-30", customer:"Rahul", amount:720, status:"Delivered" },
      { orderId:"ORD1013", date:"2025-11-30", customer:"Anita", amount:1280, status:"Pending" },
      { orderId:"ORD1014", date:"2025-11-29", customer:"Rohit", amount:460, status:"Delivered" },
    ]);
  },[id]);

  return (
    <AdminLayout title={`History — ${id}`}>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Delivery History</h3>

        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-2 text-left">Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h=>(
              <tr key={h.orderId} className="border-b border-slate-700">
                <td className="py-2">{h.orderId}</td>
                <td>{h.date}</td>
                <td>{h.customer}</td>
                <td>₹{h.amount}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${h.status==="Delivered" ? "bg-green-700" : "bg-yellow-700"}`}>
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
            {history.length===0 && <tr><td colSpan={5} className="py-6 text-center text-slate-500">No history</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
