import { useEffect, useState } from "react";

export default function VegetablesPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Backend se data fetch
  useEffect(() => {
    fetch("http://localhost:5000/api/products/vegetables")  // ← future backend route
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-6 md:px-20 py-16">

      <h1 className="text-3xl md:text-4xl font-bold text-green-600">
        Fresh Vegetables 🥬
      </h1>
      <p className="text-gray-500 mt-2">
        Straight from the farm to your home — 100% Organic 🌱
      </p>


      {/* ⏳ Loader */}
      {loading && (
        <div className="flex justify-center mt-14">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {/* ❌ Error */}
      {error && <p className="text-red-500 text-center mt-10">{error}</p>}


      {/* 🟢 Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">

        {products.map(item => (
          <div
            key={item._id}
            className="bg-white dark:bg-[#0f1218] p-4 rounded-2xl shadow hover:scale-[1.03] transition cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="mt-3 font-semibold text-lg text-gray-900 dark:text-gray-200">
              {item.name}
            </h2>

            <p className="text-green-600 font-bold mt-1">
              ₹{item.price} / {item.unit}
            </p>

            <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition">
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
