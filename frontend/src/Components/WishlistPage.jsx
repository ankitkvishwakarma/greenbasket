// src/Components/WishlistPage.jsx

import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { addToCart } from "../utils/Cart";
import {
  getWishlistLocal,
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistLocal,
} from "../utils/wishlistLocal";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [usingBackend, setUsingBackend] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Load wishlist (backend first, fallback local)
  async function loadWishlist() {
    setLoading(true);
    try {
      const { data } = await API.get("/wishlist");
      // assume data.wishlist is array of products or product refs
      const list = Array.isArray(data.wishlist) ? data.wishlist : [];
      setItems(list);
      setUsingBackend(true);
    } catch (err) {
      console.warn("Backend wishlist not available, using local:", err);
      const local = getWishlistLocal();
      setItems(local);
      setUsingBackend(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function handleRemove(id) {
    if (usingBackend) {
      try {
        await API.delete(`/wishlist/${id}`);
        setItems((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Remove wishlist backend error:", err);
      }
    } else {
      removeFromWishlistLocal(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
    }
  }

  async function handleMoveToCart(product) {
    // 🛒 Add to cart (frontend util + backend cart)
    addToCart(product);
    try {
      await API.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
    } catch (err) {
      console.error("Add to cart backend error:", err);
    }

    // optional: remove from wishlist
    handleRemove(product._id);
  }

  function handleCheckoutItem(product) {
    // Single-product checkout from wishlist
    navigate("/checkout", {
      state: {
        source: "wishlist",
        items: [
          {
            ...product,
            quantity: 1,
          },
        ],
      },
    });
  }

  function handleCheckoutAll() {
    if (!items.length) return;
    navigate("/checkout", {
      state: {
        source: "wishlist",
        items: items.map((p) => ({ ...p, quantity: 1 })),
      },
    });
  }

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-700 dark:text-gray-200">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white dark:bg-[#0f172a] shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Wishlist
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleCheckoutAll}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Checkout All
            </button>
          )}
        </div>

        {items.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300">
            No items in wishlist yet.
          </p>
        )}

        <div className="space-y-4">
          {items.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image || p.photo}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    ₹ {p.price} {p.unit ? `/ ${p.unit}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleMoveToCart(p)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Move to Cart
                </button>

                <button
                  onClick={() => handleCheckoutItem(p)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleRemove(p._id)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
