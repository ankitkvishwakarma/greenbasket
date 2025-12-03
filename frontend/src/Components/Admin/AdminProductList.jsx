import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await API.get("/api/products"); // public route
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/api/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link to="/admin/add-product" className="btn">Add Product</Link>
      </div>

      <table className="w-full mt-4">
        <thead> ... </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td><img src={p.images?.[0]} className="w-12 h-12 object-cover" alt="" /></td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <Link to={`/admin/products/${p._id}/edit`} className="mr-2">Edit</Link>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
