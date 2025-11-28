import React, { useState } from "react";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ankit Kumar",
    email: "ankit@example.com",
    phone: "9876543210",
    address: "Lucknow, Uttar Pradesh",
    avatar: "https://via.placeholder.com/120",
  });

  const [orders] = useState([
    { id: 101, item: "Green Basket Combo Pack", date: "12 Nov 2025", status: "Delivered" },
    { id: 102, item: "Fresh Veggies Pack", date: "27 Nov 2025", status: "Pending" }
  ]);

  const [reviews] = useState([
    { product: "Organic Tomato", rating: 5, message: "Fresh and amazing quality!" },
    { product: "Potato 1kg", rating: 4, message: "Good but size could be bigger." }
  ]);

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, avatar: URL.createObjectURL(file) });
  };

  const saveProfile = () => {
    setEditMode(false);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl">

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border"
          />

          {editMode && (
            <input type="file" onChange={handleAvatarChange} className="text-sm" />
          )}
        </div>

        {/* Profile Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              disabled={!editMode}
              value={profile.name}
              onChange={handleInput}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              disabled={!editMode}
              value={profile.email}
              onChange={handleInput}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div>
            <label className="font-semibold">Phone Number:</label>
            <input
              type="text"
              name="phone"
              disabled={!editMode}
              value={profile.phone}
              onChange={handleInput}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div>
            <label className="font-semibold">Address:</label>
            <textarea
              name="address"
              disabled={!editMode}
              value={profile.address}
              onChange={handleInput}
              className="w-full p-2 mt-1 border rounded-md"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-5 gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={saveProfile}
              className="px-5 py-2 bg-green-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Order Details */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">📦 Order History</h2>
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o.id} className="p-3 border rounded-md bg-gray-50 flex justify-between">
                <span>{o.item} - {o.date}</span>
                <span className="font-semibold text-green-700">{o.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">⭐ Product Reviews</h2>
          <div className="space-y-2">
            {reviews.map((r, i) => (
              <div key={i} className="p-3 border rounded-md bg-gray-50">
                <p><b>{r.product}</b> - {r.rating}★</p>
                <p>{r.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
