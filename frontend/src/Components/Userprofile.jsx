import React, { useEffect, useState } from "react";
import { Pencil, Save, Camera } from "lucide-react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { addToCart } from "../utils/Cart";

function OrderTrackModal({ order, onClose }) {
  if (!order) return null;

  const steps = ["PENDING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStep = steps.indexOf(order.status.toUpperCase()) + 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-end z-50">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0e1628] rounded-t-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-gray-100">
          Order Tracking
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-center mb-5 text-sm">
          Order ID: {order._id}
        </p>

        <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full mb-8">
          <div
            className="h-full bg-green-600 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <div
              className={`w-4 h-4 rounded-full ${i < currentStep ? "bg-green-600" : "bg-gray-400"}`}
            ></div>
            <p
              className={`font-medium ${
                i < currentStep ? "text-green-600" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.replace("_", " ")}
            </p>
          </div>
        ))}

        <button
          onClick={onClose}
          className="w-full bg-red-500 hover:bg-red-600 text-white mt-5 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [saving, setSaving] = useState(false);

  // Address Form
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullAddress: "",
    phone: "",
  });

  const TABS = ["Profile", "Orders", "Wishlist", "Notifications"];

  // LOAD USER
  async function loadUser() {
    const { data } = await API.get("/user/me");
    setUser(data.user);
  }

  async function loadOrders() {
    const { data } = await API.get("/orders/my");
    setOrders(data.orders || []);
  }

  async function loadWishlist() {
    try {
      const { data } = await API.get("/wishlist");
      setWishlist(data.wishlist || []);
    } catch {
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(local);
    }
  }

  async function loadNotifications() {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data.list || []);
    } catch {
      setNotifications([]);
    }
  }

  useEffect(() => {
    loadUser();
    loadOrders();
    loadWishlist();
    loadNotifications();
  }, []);

  if (!user)
    return <div className="pt-32 text-center text-gray-700 dark:text-gray-300">Loading profile...</div>;

  // SAVE PROFILE (name, phone, avatar, addresses)
  async function saveProfile() {
    try {
      setSaving(true);

      const form = new FormData();
      form.append("name", user.name);
      form.append("phone", user.phone);

      if (user.avatarFile) form.append("avatar", user.avatarFile);

      form.append("addresses", JSON.stringify(user.addresses || []));

      const { data } = await API.put("/user/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data.user);
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  // Avatar upload handler
  function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUser({
      ...user,
      avatarFile: file,
      avatar: URL.createObjectURL(file),
    });
  }

  // ADD ADDRESS (Direct Input Form)
  async function saveAddress() {
    if (!addressForm.label || !addressForm.fullAddress || !addressForm.phone) {
      return alert("Please fill all address fields");
    }

    const updated = [...(user.addresses || []), addressForm];

    setUser({ ...user, addresses: updated });

    const form = new FormData();
    form.append("name", user.name);
    form.append("phone", user.phone);
    form.append("addresses", JSON.stringify(updated));

    await API.put("/user/me", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setAddressForm({ label: "", fullAddress: "", phone: "" });
  }

  // DELETE ADDRESS
  async function deleteAddress(index) {
    const updated = user.addresses.filter((_, i) => i !== index);
    setUser({ ...user, addresses: updated });

    const form = new FormData();
    form.append("name", user.name);
    form.append("phone", user.phone);
    form.append("addresses", JSON.stringify(updated));

    await API.put("/user/me", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return (
    <div className="pt-32 pb-20 px-4 w-full flex justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">

        {/* LEFT SIDEBAR */}
        <div className="md:w-1/3 w-full bg-white dark:bg-[#0f172a] shadow-lg rounded-xl p-6 h-fit">
          <div className="flex flex-col items-center">

            <div className="relative">
              <img
                src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-28 h-28 rounded-full object-cover border shadow-md"
              />

              {editMode && (
                <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer shadow-lg hover:bg-green-700">
                  <Camera size={18} className="text-white" />
                  <input type="file" onChange={handleAvatarUpload} className="hidden" />
                </label>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-gray-600 dark:text-gray-400">{user.phone}</p>

            {!editMode ? (
              <button
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                onClick={() => setEditMode(true)}
              >
                <Pencil size={18} /> Edit Profile
              </button>
            ) : (
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                onClick={saveProfile}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save"}
              </button>
            )}

            <Link
              to="/change-password"
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Change Password
            </Link>

            <div className="mt-8 space-y-3 w-full">
              {["Profile", "Orders", "Wishlist", "Notifications"].map((tab) => (
                <button
                  key={tab}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                    activeTab === tab
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-white dark:bg-[#0f172a] shadow-lg rounded-xl p-6">

          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <div className="space-y-6">

              {/* BASIC INFO */}
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize text-gray-700 dark:text-gray-300">{field}</label>

                  <input
                    disabled={!editMode || field === "email"}
                    value={user[field] || ""}
                    onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}

              {/* SAVED ADDRESSES */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Saved Addresses</h3>

                {(user.addresses || []).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-300">No saved addresses.</p>
                )}

                {(user.addresses || []).map((addr, index) => (
                  <div
                    key={index}
                    className="p-4 mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{addr.label}</p>
                      <p className="text-gray-600 dark:text-gray-300">{addr.fullAddress}</p>
                      <p className="text-gray-600 dark:text-gray-300">{addr.phone}</p>
                    </div>

                    <button
                      onClick={() => deleteAddress(index)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD ADDRESS FORM */}
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Add Address
                </h3>

                <input
                  placeholder="Label (Home / Office)"
                  className="w-full mb-3 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                />

                <textarea
                  placeholder="Full Address"
                  className="w-full mb-3 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={addressForm.fullAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                ></textarea>

                <input
                  placeholder="Phone Number"
                  className="w-full mb-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                />

                <button
                  onClick={saveAddress}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "Orders" && (
            <div className="space-y-5">
              {orders.map((o) => (
                <div key={o._id} className="p-5 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Order #{o._id}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{o.items.length} items</p>
                  <p className="text-green-600 dark:text-green-400 font-semibold">₹ {o.totalAmount}</p>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Track Order
                  </button>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-gray-500 dark:text-gray-300">You have no orders yet.</p>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "Wishlist" && (
            <div className="space-y-5">
              {wishlist.length === 0 && (
                <p className="text-gray-500 dark:text-gray-300">Your wishlist is empty.</p>
              )}

              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img src={item.image || item.photo} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">₹ {item.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "Notifications" && (
            <div className="space-y-3">
              {notifications.map((msg, i) => (
                <div
                  key={i}
                  className="p-4 bg-yellow-200 dark:bg-yellow-800 rounded-lg text-gray-900 dark:text-gray-100"
                >
                  {msg}
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-gray-500 dark:text-gray-300">No notifications yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ORDER TRACK MODAL */}
      {selectedOrder && (
        <OrderTrackModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
