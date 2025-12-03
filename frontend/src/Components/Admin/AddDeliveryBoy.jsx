import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AddDeliveryBoy() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
  });

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value});
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Delivery Boy Added:", form);
    alert("Added successfully (backend connect karna baad me)");
  }

  return (
    <AdminLayout title="Add Delivery Boy">
      <form onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md">

        <div className="mb-3">
          <label className="text-slate-300 text-sm">Full Name</label>
          <input name="name" onChange={handleChange}
            className="inputField" required />
        </div>

        <div className="mb-3">
          <label className="text-slate-300 text-sm">Phone Number</label>
          <input name="phone" onChange={handleChange}
            className="inputField" required />
        </div>

        <div className="mb-4">
          <label className="text-slate-300 text-sm">Vehicle</label>
          <input name="vehicle" onChange={handleChange}
            className="inputField" required />
        </div>

        <button className="w-full bg-lime-500 text-slate-900 py-2 rounded-lg font-semibold">
          Add Delivery Boy
        </button>
      </form>
    </AdminLayout>
  );
}
