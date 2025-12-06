import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import API from "../../../api/axios";   // ⭐ axios instance import

export default function ForgotPassword(){

  const [email,setEmail] = useState("");

  async function sendLink(){
    try {
      await API.post("/auth/forgot-password", { email });
      alert("Password reset link has been sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link ❌");
      console.log(err);
    }
  }

  return(
    <AuthLayout title="Forgot Password?">

      <input 
        className="inputAuth" 
        placeholder="Enter Email"
        value={email} 
        onChange={e=>setEmail(e.target.value)}
      />

      <button className="btnBlue w-full" onClick={sendLink}>
        Send Reset Link
      </button>

      <p className="text-sm mt-4 text-center">
        Back to 
        <Link to="/login" className="text-blue-600 font-semibold ml-1">Login</Link>
      </p>
    </AuthLayout>
  );
}
