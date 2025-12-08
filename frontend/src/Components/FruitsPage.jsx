import { useEffect, useState } from "react";
import API from "../../api/axios";
import { addToCart } from "../utils/Cart";
import { Link } from "react-router-dom";

export default function FruitsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFruits() {
      try {
        const { data } = await API.get("/products/category/fruits");
        setProducts(data.products || []);
      } catch (err) {
        setError("Failed to load fruits ❌");
      } finally {
        setLoading(false);
      }
    }

    loadFruits();
  }, []);

  return (
    <div className="px-6 md:px-20 py-16">

      {/* 🔥 Heading with padding top */}
      <h1 className="text-3xl font-bold text-orange-500 pt-4">
        Fresh Fruits 🍎
      </h1>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-14">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-center mt-10">{error}</p>}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-[#0f1218] p-4 rounded-2xl shadow"
          >
            {/* ⭐ PRODUCT DETAIL LINK RESTORED */}
            <Link to={`/product/${item._id}`}>
              <img
                src={item.images?.[0] || "/no-image.png"}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg cursor-pointer"
              />
            </Link>

            <Link to={`/product/${item._id}`}>
              <h2 className="mt-3 font-semibold text-lg dark:text-white hover:underline">
                {item.name}
              </h2>
            </Link>

            <p className="text-orange-600 font-bold mt-1">
              ₹{item.price} / {item.unit || "pcs"}
            </p>

            {/* ⭐ FIXED ADD TO CART */}
            <button
              onClick={() => addToCart(item._id)}
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600"
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
