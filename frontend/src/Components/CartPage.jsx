import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { loadCartCount } = useCart();
  const navigate = useNavigate();

  // LOAD CART FROM BACKEND
  async function loadCart() {
    try {
      setLoading(true);
      const { data } = await API.get("/cart");
      setCart(data.cart || { items: [] });
      await loadCartCount();
    } catch (err) {
      console.error("Cart load error:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  // UPDATE QUANTITY
  async function updateQty(productId, newQty) {
    if (newQty < 1) return;
    try {
      setUpdating(true);
      await API.put("/cart/update", { productId, quantity: newQty });
      await loadCart();
    } catch (err) {
      console.error("Update qty error:", err);
    } finally {
      setUpdating(false);
    }
  }

  // REMOVE SINGLE ITEM
  async function removeItem(productId) {
    try {
      setUpdating(true);
      await API.delete(`/cart/item/${productId}`);
      await loadCart();
    } catch (err) {
      console.error("Remove item error:", err);
    } finally {
      setUpdating(false);
    }
  }

  // CLEAR ENTIRE CART
  async function clearWholeCart() {
    try {
      if (!window.confirm("Clear entire cart?")) return;
      setUpdating(true);
      await API.delete("/cart/clear");
      await loadCart();
    } catch (err) {
      console.error("Clear cart error:", err);
    } finally {
      setUpdating(false);
    }
  }

  // ⭐ NEW: CHECKOUT PROCESS — ORDER CREATE & REDIRECT
  async function handleCheckout() {
    try {
      setUpdating(true);

      const res = await API.post("/orders/checkout", {
        paymentStatus: "PAID",
      });

      alert("Order placed successfully!");

      await loadCartCount(); // cart icon update

      navigate("/my-orders");

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-28 flex justify-center items-center">
        <p className="text-lg font-semibold">Loading your cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];

  // EMPTY CART UI
  if (!items.length) {
    return (
      <div className="pt-28 max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Start adding fresh items to your basket.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // CALCULATE TOTAL
  const totalAmount = items.reduce((sum, item) => {
    const p = item.productId;
    return sum + (p?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="pt-28 max-w-5xl mx-auto px-4 md:px-0 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Cart</h1>

        <button
          onClick={clearWholeCart}
          disabled={updating}
          className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT SIDE – CART ITEMS */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 md:p-6">
          {items.map((item) => {
            const p = item.productId;
            if (!p) return null;

            return (
              <div
                key={item._id}
                className="flex gap-4 py-4 border-b last:border-b-0 dark:border-slate-700"
              >
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/80"}
                  alt={p.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-200"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{p.name}</h2>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    ₹{p.price} {p.unit ? `/ ${p.unit}` : ""}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQty(p._id, item.quantity - 1)}
                      disabled={updating}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
                    >
                      -
                    </button>

                    <span className="px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQty(p._id, item.quantity + 1)}
                      disabled={updating}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(p._id)}
                    disabled={updating}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-right font-semibold">
                  ₹{(p.price || 0) * item.quantity}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE – SUMMARY */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 md:p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2 text-sm">
            <span>Total Items</span>
            <span>{items.length}</span>
          </div>

          <div className="flex justify-between mb-2 text-sm">
            <span>Total Quantity</span>
            <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
          </div>

          <div className="border-t border-dashed my-3 dark:border-slate-600" />

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-2xl text-green-600">
              ₹{totalAmount}
            </span>
          </div>

          {/* ⭐ UPDATED CHECKOUT BUTTON */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
            disabled={updating}
          >
            {updating ? "Processing..." : "Proceed to Checkout"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 text-sm text-green-600 hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
