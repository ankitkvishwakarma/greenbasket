import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/products");

      if (!Array.isArray(res.data.products)) {
        throw new Error("API returned invalid data");
      }

      setProducts(res.data.products);
    } catch (err) {
      console.error("Products load error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  }

  return (
    <AdminLayout title="Manage Products">
      <div className="p-4">

        {/* Error Box */}
        {error && (
          <div className="bg-red-600/20 border border-red-700 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-slate-300">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400">
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-slate-700">
                    <td className="px-3 py-3">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          className="w-14 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-14 h-12 bg-slate-900 rounded text-xs text-slate-500 flex justify-center items-center">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3 text-slate-200">{p.name}</td>
                    <td className="px-3 py-3 text-slate-200">{p.category}</td>
                    <td className="px-3 py-3 text-slate-200">₹{p.price}</td>
                    <td className="px-3 py-3 text-slate-200">{p.stock}</td>

                    <td className="px-3 py-3 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/${p._id}/edit`)
                        }
                        className="bg-slate-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
