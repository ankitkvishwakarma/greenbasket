// src/Components/Admin/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    discount: 0,
    imageUrl: "",
  });

  const [files, setFiles] = useState([]); // file objects
  const [previews, setPreviews] = useState([]); // preview urls
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onFilesSelect(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  async function uploadImages() {
    if (!files || files.length === 0) return form.imageUrl ? [form.imageUrl] : [];

    const fd = new FormData();
    files.forEach((f) => fd.append("images", f)); // field name MUST be "images"
    const res = await API.post("/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.urls || [];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const uploadedUrls = await uploadImages();

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        discount: Number(form.discount || 0),
        images: uploadedUrls.length ? uploadedUrls : form.imageUrl ? [form.imageUrl] : [],
      };

      // backend route: POST /api/products/create
      await API.post("/products/create", payload);

      navigate("/admin/products");
    } catch (err) {
      console.error("Add product error:", err?.response || err);
      alert("Product add failed. Check console for details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Add New Product">
      <div className="mx-auto max-w-4xl p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-300">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                placeholder="Tomato / Apple"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                placeholder="vegetables / fruits / dairy"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-slate-300">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
              rows="3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-start">
            <div>
              <label className="text-xs text-slate-300">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesSelect}
                className="mt-2 w-full text-slate-300 text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Upload one or more images. Or paste a direct image URL below.
              </p>

              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="mt-3 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400"
                placeholder="or paste image URL (first image)"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {previews.length ? (
                previews.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt="preview"
                    className="w-28 h-28 rounded-lg object-cover border border-slate-600"
                  />
                ))
              ) : form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="w-32 h-32 rounded-lg object-cover border border-slate-600"
                />
              ) : (
                <div className="w-32 h-32 border border-dashed rounded-lg flex items-center justify-center text-xs text-slate-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold rounded-lg py-3 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
