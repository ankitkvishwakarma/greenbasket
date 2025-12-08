import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api/axios"; 
import AdminLayout from "./AdminLayout";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await API.get("/products");   // ⭐ FIXED
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);   // ⭐ FIXED
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <AdminLayout title="Products">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Products</h1>
          <Link to="/admin/add-product" className="btn">
            Add Product
          </Link>
        </div>

        <table className="w-full mt-4 text-white">
          <thead>
            <tr className="text-left border-b border-white/20">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-white/10">
                <td className="p-2">
                  <img
                    src={p.images?.[0]}
                    className="w-12 h-12 object-cover rounded"
                    alt=""
                  />
                </td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">{p.stock}</td>

                <td className="p-2">
                  <Link
                    to={`/admin/products/${p._id}`}
                    className="mr-2 text-blue-400"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
