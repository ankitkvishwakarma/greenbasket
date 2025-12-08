import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    discount: 0,
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("discount", form.discount);
      fd.append("description", form.description);

      files.forEach((file) => fd.append("images", file));

      const res = await API.post("/admin/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product Created");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Add Product">
      <div className="max-w-3xl mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="vegetables / fruits / dairy"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Price (₹)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
            <Field
              label="Stock"
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
            <Field
              label="Discount (%)"
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full text-sm text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold rounded-lg py-3 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-300">{label}</label>
      <input
        {...props}
        className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
