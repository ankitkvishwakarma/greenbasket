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
    async function loadData() {
      try {
        const res = await API.get(`/products/${id}`);
        const p = res.data.product;

        setForm({
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          description: p.description,
          discount: p.discount,
          images: p.images, // Cloudinary URLs
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ============================================================
       SELECT NEW IMAGES (LOCAL PREVIEW ONLY)
  ============================================================ */
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setNewFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  /* ============================================================
       SUBMIT — DIRECT CLOUDINARY UPLOAD THROUGH BACKEND
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();

      // append text fields
      Object.keys(form).forEach((key) => {
        if (key !== "images") {
          fd.append(key, form[key]);
        }
      });

      // append new files (will go to Cloudinary)
      newFiles.forEach((file) => fd.append("images", file));

      await API.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product Updated Successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <p className="text-slate-300 p-6">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${form.name}`}>
      <div className="max-w-3xl mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6"
        >
          {/* NAME + CATEGORY */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InputBox label="Name" name="name" value={form.name} onChange={handleChange} />
            <InputBox
              label="Category"
              name="category"
              value={form.category}
              placeholder="vegetables / fruits"
              onChange={handleChange}
            />
          </div>

          {/* PRICE / STOCK / DISCOUNT */}
          <div className="grid gap-4 sm:grid-cols-3">
            <InputBox
              label="Price (₹)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
            <InputBox
              label="Stock"
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
            <InputBox
              label="Discount (%)"
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
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

          {/* IMAGES */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-300">Upload New Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="mt-2 text-sm text-slate-300"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {/* New Previews */}
              {previews.length > 0 &&
                previews.map((src, idx) => (
                  <img key={idx} src={src} className="w-28 h-28 rounded-lg object-cover border" />
                ))}

              {/* Old images (if no new images selected) */}
              {previews.length === 0 &&
                form.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-28 h-28 rounded-lg object-cover border"
                  />
                ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded py-3 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

function InputBox({ label, ...props }) {
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
