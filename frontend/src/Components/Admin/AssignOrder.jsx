import AdminLayout from "./AdminLayout";
import { useParams } from "react-router-dom";

export default function AssignOrder() {
  const { id } = useParams();

  const orders = [
    { id: "ORD1012", customer: "Rahul Sharma", amount: 720 },
    { id: "ORD1013", customer: "Anita Verma", amount: 1280 },
    { id: "ORD1014", customer: "Rohit Kumar", amount: 460 },
  ];

  return (
    <AdminLayout title={`Assign Order to Delivery Boy #${id}`}>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">

        <h2 className="text-white text-lg mb-4">Available Orders</h2>

        {orders.map(o => (
          <div key={o.id}
            className="border border-slate-700 rounded-lg p-3 mb-3 flex justify-between">

            <div className="text-slate-300">
              <p><b>{o.id}</b></p>
              <p>{o.customer}</p>
            </div>

            <button
              className="px-4 bg-blue-500 text-white rounded-md">
              Assign
            </button>
          </div>
        ))}

      </div>
    </AdminLayout>
  );
}
