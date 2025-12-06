import { useEffect, useState } from "react";
import API from "../../api/axios";   // ⭐ axios instance import

export default function FruitsPage() {

  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Fetch data from backend (only fruits)
  useEffect(() => {
    async function loadFruits() {
      try {
        const { data } = await API.get("/products/fruits");
        setFruits(data);
      } catch (err) {
        setError("Failed to load fruits data ❌");
      } finally {
        setLoading(false);
      }
    }
    loadFruits();
  }, []);

  return (
    <div className="px-6 md:px-20 py-16">

      <h1 className="text-3xl md:text-4xl font-bold text-orange-500">
        Fresh & Juicy Fruits 🍎🍊
      </h1>
      <p className="text-gray-500 mt-2">
        Handpicked natural sweetness — Healthy, Organic & Farm Fresh 🍃
      </p>

      {/* ⏳ Loading */}
      {loading && (
        <div className="flex justify-center mt-14">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent animate-spin rounded-full" />
        </div>
      )}

      {/* ❌ Error Text */}
      {error && <p className="text-red-500 text-center mt-10">{error}</p>}

      {/* 🟢 Fruits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {fruits.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-[#0f1218] p-4 rounded-2xl shadow hover:scale-[1.03] duration-300 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h2 className="mt-3 font-semibold text-lg text-gray-900 dark:text-gray-200">
              {item.name}
            </h2>

            <p className="text-orange-600 font-bold mt-1">
              ₹{item.price} / {item.unit}
            </p>

            <button className="w-full mt-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600">
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
