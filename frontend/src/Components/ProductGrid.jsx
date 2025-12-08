import { useEffect, useState } from "react";
import { useFlyToCart } from "../hooks/useFlyToCart";
import API from "../../api/axios";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  const { flyToCart } = useFlyToCart();
  const { increaseCount } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await API.get("/products?limit=8");

        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.products)) setProducts(data.products);
        else setProducts([]);

      } catch (err) {
        console.log("Product load error:", err);
        setProducts([]);
      }
    }
    loadProducts();
  }, []);

  // BACKEND CART ADD
  async function addToCartBackend(id) {
    await API.post("/cart/add", { productId: id });
  }

  const handleAdd = async (e, p) => {
    const rect = e.target.getBoundingClientRect();

    flyToCart(p.images?.[0], { x: rect.left, y: rect.top });

    await addToCartBackend(p._id);
    increaseCount(1);
  };

  return (
    <div className="px-6 md:px-20 py-16">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Popular Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">

        {products.map((p, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] p-5 rounded-2xl shadow-lg
                       transform transition-all duration-300 
                       hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03]"
          >

            {/* CLICK → OPEN PRODUCT DETAILS */}
            <Link to={`/product/${p._id}`} className="block text-center">
              <img
                src={p.images?.[0] || "/no-image.png"}
                className="w-24 h-24 md:w-28 md:h-28 mx-auto object-contain"
                alt={p.name}
              />

              <h3 className="mt-3 font-semibold dark:text-white text-sm md:text-base">
                {p.name}
              </h3>

              <p className="text-green-600 font-bold text-sm md:text-base">
                ₹{p.price} {p.unit ? `/ ${p.unit}` : ""}
              </p>
            </Link>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={(e) => handleAdd(e, p)}
              className="mt-4 w-full py-2 rounded-full bg-green-600 text-white 
                         hover:bg-green-700 transition"
            >
              Add to Cart 🛒
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}
