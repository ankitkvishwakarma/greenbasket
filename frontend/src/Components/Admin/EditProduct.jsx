// src/Components/Admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API from "../../../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    discount: 0,
    images: [],
  });
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/products/${id}`);
        const p = res.data.product;
        setForm({
          name: p.name || "",
          category: p.category || "",
          price: p.price || 0,
          stock: p.stock || 0,
          description: p.description || "",
          discount: p.discount || 0,
          images: p.images || [],
        });
      } catch (err) {
        console.error("Failed to load product:", err?.response || err);
        alert("Could not load product");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onFilesSelect(e) {
    const selected = Array.from(e.target.files || []);
    setNewFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  async function uploadNewFiles() {
    if (!newFiles || newFiles.length === 0) return [];
    const fd = new FormData();
    newFiles.forEach((f) => fd.append("images", f));
    const res = await API.post("/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.urls || [];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const uploaded = await uploadNewFiles();
      const finalImages = uploaded.length ? uploaded : form.images;

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        discount: Number(form.discount || 0),
        images: finalImages,
      };

      await API.put(`/products/${id}`, payload);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err?.response || err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="p-6 text-slate-300">Loading product...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${form.name || "Product"}`}>
      <div className="mx-auto max-w-3xl p-4">
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-300">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" />
            </div>

            <div>
              <label className="text-xs text-slate-300">Category</label>
              <input name="category" value={form.category} onChange={handleChange} required className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" placeholder="vegetables / fruits / dairy" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-slate-300">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" />
            </div>

            <div>
              <label className="text-xs text-slate-300">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" />
            </div>

            <div>
              <label className="text-xs text-slate-300">Discount (%)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-start">
            <div>
              <label className="text-xs text-slate-300">Upload new images (optional)</label>
              <input type="file" accept="image/*" multiple onChange={onFilesSelect} className="mt-2 w-full text-slate-300 text-sm" />
              <p className="text-[11px] text-slate-500 mt-2">If you don't upload new images, existing images will remain.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {previews.length ? (
                previews.map((u, i) => <img key={i} src={u} alt="" className="w-28 h-28 rounded-lg object-cover border border-slate-600" />)
              ) : form.images && form.images.length ? (
                form.images.map((u, i) => <img key={i} src={u} alt="" className="w-28 h-28 rounded-lg object-cover border border-slate-600" />)
              ) : (
                <div className="w-32 h-32 border border-dashed rounded-lg flex items-center justify-center text-xs text-slate-500">No Image</div>
              )}
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold rounded-lg py-3 transition disabled:opacity-50">
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
