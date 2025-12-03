import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submitLogin() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid Credentials");
        return;
      }

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

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
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

      {/* ⭐ ADD ADMIN LOGIN LINK HERE ⭐ */}
      <p className="text-sm mt-2 text-center">
        Admin Login?
        <Link to="/admin/login" className="text-red-600 font-semibold ml-1">
          Click Here
        </Link>
      </p>

    </AuthLayout>
  );
}
