import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";

export default function DeliveryBoyList() {

  const sampleBoys = [
    { id: 1, name: "Aman Singh", phone: "9876543210", status: "Online", orders: 5 },
    { id: 2, name: "Rohit Kumar", phone: "9123456780", status: "Busy", orders: 2 },
    { id: 3, name: "Dinesh Rao", phone: "9988776655", status: "Offline", orders: 0 },
  ];

  return (
    <AdminLayout title="Delivery Boys">

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">All Delivery Boys</h2>
        <Link to="/admin/delivery/add"
          className="px-4 py-2 bg-lime-500 rounded-md font-semibold text-slate-900">
          + Add Delivery Boy
        </Link>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <table className="w-full text-slate-300 text-sm">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Orders Assigned</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sampleBoys.map(boy => (
              <tr key={boy.id} className="border-b border-slate-700">
                <td className="py-3">{boy.name}</td>
                <td>{boy.phone}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs 
                    ${boy.status === "Online" ? "bg-green-600" : 
                      boy.status === "Busy" ? "bg-yellow-600" : "bg-red-600"}`}>
                    {boy.status}
                  </span>
                </td>
                <td>{boy.orders}</td>
                <td>
                  <Link to={`/admin/delivery/assign/${boy.id}`}
                    className="text-blue-400 hover:underline">
                    Assign Order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </AdminLayout>
  );
}
