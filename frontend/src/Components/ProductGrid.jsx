// ProductGrid.jsx
import { useEffect, useState } from "react";
import { useFlyToCart } from "../hooks/useFlyToCart";
import { addToCart } from "../utils/Cart";
import API from "../../api/axios";     // ⭐ axios instance import

export default function ProductGrid() {

  const { flyToCart } = useFlyToCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await API.get("/products?limit=8");

        // 🔥 SAFE HANDLING (backend kuch bhi return kare → app crash nahi hoga)
        if (Array.isArray(data)) {
          setProducts(data);
        } 
        else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } 
        else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } 
        else {
          setProducts([]); // fallback safe value
        }

      } catch (err) {
        console.error("Product Fetch Error:", err);
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  const handleAdd = (e, product) => {
    const rect = e.target.getBoundingClientRect();

    // 🟢 Fly Animation
    flyToCart(product.image, { x: rect.left, y: rect.top });

    // 🛒 Add to Cart
    addToCart(product);
  };

  return (
    <div className="px-8 md:px-20 py-16">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Popular Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

        {products.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300">
            No products found
          </p>
        )}

        {products.map((p, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] p-5 rounded-2xl shadow-lg"
          >
            <img
              src={p.image}
              className="w-28 h-28 mx-auto object-contain"
              alt={p.name}
            />

            <h3 className="mt-3 font-semibold dark:text-white">{p.name}</h3>
            <p className="text-green-600 font-bold">
              ₹{p.price} / {p.unit}
            </p>

            <button
              onClick={(e) => handleAdd(e, p)}
              className="mt-4 w-full py-2 rounded-full bg-green-600 text-white"
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
