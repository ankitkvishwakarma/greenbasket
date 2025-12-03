// src/Components/Admin/DeliveryMap.jsx
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DeliveryMap(){
  const { id } = useParams();
  const [pos, setPos] = useState({ lat:28.6139, lng:77.2090 });

  useEffect(()=>{
    // Simulated live location ping every 3s (for UI demo)
    const t = setInterval(()=>{
      setPos(p => ({
        lat: p.lat + (Math.random()-0.5)/500,
        lng: p.lng + (Math.random()-0.5)/500
      }));
    }, 3000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <AdminLayout title={`Live Location — ${id}`}>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-white mb-3">Live Location (Demo)</h3>

        <div className="mb-4">
          <div className="h-64 w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
            {/* Replace this box with map component (Leaflet/Google) */}
            <div className="text-slate-400">
              <div className="text-white font-semibold mb-2">Latitude: {pos.lat.toFixed(5)}</div>
              <div className="text-white font-semibold">Longitude: {pos.lng.toFixed(5)}</div>
              <p className="mt-2 text-sm">(Map placeholder — integrate leaflet or Google Maps here)</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Use <code>/api/delivery/{id}/location</code> to push live coords from driver app.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
