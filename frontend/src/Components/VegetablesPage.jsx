import { useEffect, useState } from "react";
import API from "../../api/axios";   // ⭐ axios instance import
import { addToCart } from "../utils/Cart";

export default function VegetablesPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVegetables() {
      try {
        const { data } = await API.get("/products/vegetables");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products ❌");
      } finally {
        setLoading(false);
      }
    }

    loadVegetables();
  }, []);

  return (
    <div className="px-6 md:px-20 py-16">

      <h1 className="text-3xl font-bold text-green-600">
        Fresh Vegetables 🥬
      </h1>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-14">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-10">{error}</p>}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">

        {products.map(item => (
          <div
            key={item._id}
            className="bg-white dark:bg-[#0f1218] p-4 rounded-2xl shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="mt-3 font-semibold text-lg">
              {item.name}
            </h2>

            <p className="text-green-600 font-bold mt-1">
              ₹{item.price} / {item.unit}
            </p>

            <button
              onClick={() => addToCart(item)}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl"
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
