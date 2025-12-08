import React, { useState } from "react";
import API from "../../../api/axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function changePass() {
    try {
      await API.put("/auth/change-password", { oldPassword, newPassword });
      alert("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || "Error"));
    }
  }

  return (
    <div className="pt-32 max-w-lg mx-auto px-4 pb-16">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <input
        type="password"
        placeholder="Old Password"
        className="w-full p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={changePass}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
      >
        Save Password
      </button>
    </div>
  );
}
