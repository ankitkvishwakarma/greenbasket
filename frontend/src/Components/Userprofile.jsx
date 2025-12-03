import React, { useState } from "react";
import { Pencil, Save, Camera } from "lucide-react";

/* --------------------------------------------------------
   TRACK ORDER POPUP (ANIMATED BOTTOM SHEET)
--------------------------------------------------------- */
function OrderTrackModal({ order, onClose }) {
  if (!order) return null;

  const steps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

  const currentStep =
    order.status === "Delivered"
      ? 5
      : order.status === "Out for Delivery"
      ? 4
      : order.status === "Shipped"
      ? 3
      : order.status === "Packed"
      ? 2
      : 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end z-50">
      <div
        className="
          w-full max-w-2xl
          bg-white dark:bg-[#0e1628]
          rounded-t-xl
          shadow-2xl p-6
          animate-slideUp
          border-t border-white/40 dark:border-white/10
        "
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">
          Order Tracking
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm">
          Order ID: <span className="font-semibold">{order.id}</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-green-600 animate-progress"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="relative border-l-2 border-green-500 ml-4 pl-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`mb-6 transition-all duration-500 ${
                i + 1 <= currentStep ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full absolute -left-[9px] ${
                  i + 1 <= currentStep ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
                }`}
              ></div>

              <p
                className={`font-medium ${
                  i + 1 <= currentStep
                    ? "text-green-700 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </p>

              {i + 1 === currentStep && (
                <p className="text-xs text-green-600 animate-pulse">In Progress...</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------
   MAIN USER PROFILE PAGE (FINAL VERSION)
--------------------------------------------------------- */
export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const dummyUser = {
    name: "Ankit Kumar",
    email: "ankit@gmail.com",
    phone: "9876543210",
    address: "Delhi, India",
    profilePic: "",
  };

  const [user, setUser] = useState(dummyUser);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const TABS = ["Profile", "Orders", "Wishlist", "Notifications"];
  const [activeTab, setActiveTab] = useState("Profile");

  const dummyOrders = [
    { id: "ORD12345", date: "02 Feb 2025", items: ["Tomato", "Milk", "Potato"], amount: 260, status: "Delivered" },
    { id: "ORD76543", date: "28 Jan 2025", items: ["Onion", "Bread"], amount: 140, status: "Shipped" },
  ];

  const dummyWishlist = [
    { id: 1, name: "Fresh Mango", price: 120 },
    { id: 2, name: "Organic Apple", price: 180 },
  ];

  const dummyNotifications = [
    "Your order ORD12345 has been delivered!",
    "20% OFF on Fresho Vegetables.",
    "Your wishlist item 'Apple' is now in stock.",
  ];

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUser((u) => ({ ...u, profilePic: preview }));
  };

  const saveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      alert("Profile Saved!");
    }, 800);
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-b from-[#0A122A] to-[#12203A]
        dark:from-[#080E1A] dark:to-[#0A122A]
        flex justify-center
        pt-32 pb-14 px-4
        transition-all
      "
    >
      {/* CARD */}
      <div
        className="
          w-full max-w-3xl
          bg-white/70 dark:bg-white/10
          backdrop-blur-xl 
          shadow-xl 
          rounded-xl 
          p-10 
          border border-white/30 dark:border-white/10
          transition-all
        "
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          User Profile
        </h1>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? "bg-green-600 text-white shadow scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ============================
            PROFILE TAB
        ============================ */}
        {activeTab === "Profile" && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer shadow hover:bg-green-700 transition">
                    <Camera size={18} color="white" />
                    <input type="file" onChange={handlePhoto} className="hidden" />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
              <p className="text-gray-500 dark:text-gray-300">{user.phone}</p>
            </div>

            {/* Edit / Save */}
            <div className="flex justify-center mb-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow"
                >
                  <Pencil size={18} /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>

            {/* Form */}
            <div className="space-y-5">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="text-gray-700 dark:text-gray-300 font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    name={field}
                    disabled={!editMode}
                    value={user[field]}
                    onChange={handleChange}
                    className="
                      w-full p-3 rounded-lg mt-1 
                      bg-white dark:bg-[#111827]/40 
                      border border-gray-300 dark:border-gray-700 
                      text-gray-800 dark:text-gray-200 
                      shadow-sm focus:ring-2 focus:ring-green-400 
                      transition
                    "
                  />
                </div>
              ))}

              {/* Address */}
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-medium">
                  Address
                </label>
                <textarea
                  name="address"
                  disabled={!editMode}
                  value={user.address}
                  onChange={handleChange}
                  className="
                    w-full p-3 rounded-lg mt-1 
                    bg-white dark:bg-[#111827]/40 
                    border border-gray-300 dark:border-gray-700 
                    text-gray-800 dark:text-gray-200 
                    shadow-sm focus:ring-2 focus:ring-green-400 
                    transition
                  "
                />
              </div>
            </div>
          </>
        )}

        {/* ============================
            ORDERS TAB
        ============================ */}
        {activeTab === "Orders" && (
          <div className="space-y-6">
            {dummyOrders.map((order) => (
              <div
                key={order.id}
                className="
                  w-full border p-5 
                  rounded-xl bg-gray-50 dark:bg-white/5 
                  shadow-sm hover:shadow-md transition
                "
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold dark:text-gray-200">{order.id}</h3>
                  <span className="text-gray-500 dark:text-gray-400">{order.date}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Items: {order.items.join(", ")}
                </p>

                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  ₹ {order.amount}
                </p>

                <span
                  className={`px-4 py-1 rounded-full text-white text-sm mt-2 inline-block ${
                    order.status === "Delivered" ? "bg-green-600" : "bg-yellow-600"
                  }`}
                >
                  {order.status}
                </span>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                >
                  Track Order
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ============================
            WISHLIST TAB
        ============================ */}
        {activeTab === "Wishlist" && (
          <div className="space-y-5">
            {dummyWishlist.map((item) => (
              <div
                key={item.id}
                className="
                  bg-gray-50 dark:bg-white/5 
                  p-5 
                  rounded-xl 
                  shadow-sm hover:shadow-md 
                  transition flex justify-between items-center
                "
              >
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-200">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">₹ {item.price}</p>
                </div>

                <button className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ============================
            NOTIFICATIONS TAB
        ============================ */}
        {activeTab === "Notifications" && (
          <div className="space-y-4">
            {dummyNotifications.map((msg, i) => (
              <div
                key={i}
                className="
                  bg-yellow-50 dark:bg-yellow-900/30 
                  p-4 rounded-xl 
                  border-l-4 border-yellow-600 dark:border-yellow-500 
                  shadow-sm
                "
              >
                <p className="text-gray-800 dark:text-gray-100">{msg}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Track Order Popup */}
      {selectedOrder && (
        <OrderTrackModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
