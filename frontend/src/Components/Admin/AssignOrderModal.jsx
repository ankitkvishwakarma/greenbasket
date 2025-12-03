// src/Components/Admin/AssignOrderModal.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useParams, useNavigate } from "react-router-dom";

export default function AssignOrderModal(){
  const { id } = useParams(); // delivery boy id
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{
    // TODO: fetch unassigned orders
    setOrders([
      { id:"ORD2001", customer:"Sandeep", amount:300 },
      { id:"ORD2002", customer:"Neha", amount:540 },
      { id:"ORD2003", customer:"Amrita", amount:220 },
    ]);
  },[]);

  function assignOrder(){
    if(!selected){ alert("Select an order"); return; }
    // TODO: POST /api/orders/assign { orderId, deliveryBoyId: id }
    alert(`Order ${selected} assigned to ${id} (mock).`);
    navigate(`/admin/delivery/${id}`);
  }

  return (
    <AdminLayout title={`Assign to #${id}`}>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl">
        <h3 className="text-white font-semibold mb-4">Choose Order to Assign</h3>

        {orders.map(o=>(
          <div key={o.id} className="flex items-center justify-between p-3 mb-2 bg-slate-900 rounded-lg">
            <div>
              <div className="text-white font-medium">{o.id}</div>
              <div className="text-slate-400 text-sm">{o.customer} • ₹{o.amount}</div>
            </div>
            <div>
              <input type="radio" name="assign" value={o.id} onChange={()=>setSelected(o.id)} />
            </div>
          </div>
        ))}

        <div className="mt-4 flex gap-3">
          <button onClick={assignOrder} className="px-4 py-2 bg-lime-500 rounded-md font-semibold">Assign</button>
          <button onClick={()=>navigate(-1)} className="px-4 py-2 border rounded-md">Cancel</button>
        </div>
      </div>
    </AdminLayout>
  );
}
