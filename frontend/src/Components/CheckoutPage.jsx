// src/Components/CheckoutPage.jsx

import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const wishlistItems = location.state?.items || null; // coming from WishlistPage

  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const usingWishlist = !!wishlistItems;

  async function loadUser() {
    try {
      const { data } = await API.get("/user/me");
      setUser(data.user);
    } catch (err) {
      console.error("User load error:", err);
    }
  }

  async function loadCart() {
    if (usingWishlist) {
      // we are using wishlist items, no need to load backend cart for summary
      setCartItems(wishlistItems);
      return;
    }

    try {
      const { data } = await API.get("/cart");
      const cart = data.cart || { items: [] };
      const list = (cart.items || []).map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        unit: item.productId.unit,
      }));
      setCartItems(list);
    } catch (err) {
      console.error("Cart load error:", err);
      setCartItems([]);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadUser(), loadCart()]);
      setLoading(false);
    })();
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  async function placeOrder() {
    if (!user) return;

    if (!cartItems.length) {
      alert("No items to checkout");
      return;
    }

    if (!user.addresses || !user.addresses.length) {
      alert("Please add an address in your profile first");
      return;
    }

    setPlacing(true);

    try {
      // If coming from wishlist: sync wishlist items into cart first
      if (usingWishlist) {
        // clear current cart
        try {
          await API.delete("/cart/clear");
        } catch (err) {
          console.warn("Cart clear error:", err);
        }

        // add each item to cart
        for (const item of cartItems) {
          try {
            await API.post("/cart/add", {
              productId: item._id,
              quantity: item.quantity || 1,
            });
          } catch (err) {
            console.error("Add to cart during checkout error:", err);
          }
        }
      }

      // now call backend checkoutFromCart
      const { data } = await API.post("/orders/checkout", {
        paymentMethod,
        addressIndex: selectedAddressIndex,
      });

      alert("Order placed successfully!");
      navigate("/userprofile", { state: { tab: "Orders" } });
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="pt-32 text-center text-gray-700 dark:text-gray-200">
        Loading checkout...
      </div>
    );
  }

  const addresses = user.addresses || [];

  return (
    <div className="pt-32 pb-20 px-4 flex justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        {/* LEFT: ADDRESS + PAYMENT METHOD */}
        <div className="bg-white dark:bg-[#0f172a] shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Delivery Address
          </h2>

          {addresses.length === 0 && (
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              No address found. Please add address in your profile page.
            </p>
          )}

          <div className="space-y-3 mb-6">
            {addresses.map((addr, idx) => (
              <label
                key={idx}
                className={`block border rounded-lg p-3 cursor-pointer ${
                  selectedAddressIndex === idx
                    ? "border-green-600 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={selectedAddressIndex === idx}
                  onChange={() => setSelectedAddressIndex(idx)}
                />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {addr.label}
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {addr.fullAddress}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {addr.phone}
                </p>
              </label>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Payment Method
          </h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                name="payment"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              Online Payment (coming soon)
            </label>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-white dark:bg-[#0f172a] shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    ₹ {item.price} × {item.quantity || 1}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  ₹ {item.price * (item.quantity || 1)}
                </p>
              </div>
            ))}

            {cartItems.length === 0 && (
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                No items in cart.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Total
            </span>
            <span className="font-bold text-lg text-green-600 dark:text-green-400">
              ₹ {totalAmount}
            </span>
          </div>

          <button
            disabled={placing || !cartItems.length || !addresses.length}
            onClick={placeOrder}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
