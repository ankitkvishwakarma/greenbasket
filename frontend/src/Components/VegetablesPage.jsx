import { useEffect, useState } from "react";
import API from "../../api/axios";
import { addToCart } from "../utils/Cart";
import Snackbar from "../Components/UI/Snackbar";
import { Link } from "react-router-dom";
import SuperMarketBanner from "./SuperMarketBanner";
export default function VegetablesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadVegetables() {
      try {
        const { data } = await API.get("/products/category/vegetables");
        setProducts(data.products || []);
      } catch (err) {
        setError("Failed to load products ❌");
      } finally {
        setLoading(false);
      }
    }
    loadVegetables();
  }, []);

  return (
    <div className="px-6 md:px-20 pt-19 py-16">
      <h1 className="text-3xl font-bold text-green-600 pt-4">
        Fresh Vegetables 🥬
      </h1>

      {loading && (
        <div className="flex justify-center mt-14">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-10">{error}</p>}

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

            <p className="text-green-600 font-bold mt-1">
              ₹{item.price} / {item.unit || "pcs"}
            </p>

            {/* ⭐ FIXED ADD TO CART BUTTON */}
            <button
              onClick={async () => {
                const ok = await addToCart(item._id);
                if (ok) setToast(`${item.name} added to cart 🛒`);
              }}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
           <SuperMarketBanner />
      {toast && <Snackbar message={toast} onClose={() => setToast("")} />}
    </div>
   
  );
}
