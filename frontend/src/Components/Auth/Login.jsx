import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import API from "../../../api/axios";   // ⭐ axios instance import

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submitLogin() {
    try {
      const { data } = await API.post("/auth/login", { email, password });

      // SAVE DETAILS
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", data.user.role || "USER");

      // Redirect Logic
      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials ❌");
      console.log("Login Error:", err);
    }
  }

  return (
    <AuthLayout title="Login">

      <input
        className="inputAuth"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="inputAuth"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="btnBlue w-full" onClick={submitLogin}>
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?
        <Link to="/signup" className="text-blue-600 font-semibold ml-1">
          Create Account
        </Link>
      </p>

      {/* ⭐ ADMIN LOGIN LINK ⭐ */}
      <p className="text-sm mt-2 text-center">
        Admin Login?
        <Link to="/admin/login" className="text-red-600 font-semibold ml-1">
          Click Here
        </Link>
      </p>

    </AuthLayout>
  );
}
