import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import API from "../../../api/axios";   // ⭐ axios instance import

export default function Signup(){

  const navigate = useNavigate();
  const [fullname,setFullname] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function submitSignup(){
    try {
      const { data } = await API.post("/auth/signup", {
        name: fullname,
        email,
        password
      });

      // Redirect on success
      navigate("/signup-success");
      
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed ❌");
      console.log(err);
    }
  }

  return (
    <AuthLayout title="Create Your Account">

      <input 
        className="inputAuth" 
        placeholder="Full Name"
        value={fullname} 
        onChange={e=>setFullname(e.target.value)}
      />

      <input 
        className="inputAuth" 
        placeholder="Email"
        value={email} 
        onChange={e=>setEmail(e.target.value)}
      />

      <input 
        className="inputAuth" 
        type="password" 
        placeholder="Password"
        value={password} 
        onChange={e=>setPassword(e.target.value)}
      />

      <button className="btnBlue w-full" onClick={submitSignup}>
        Sign Up
      </button>

      <p className="text-sm mt-4 text-center">
        Already have an account?
        <Link to="/login" className="text-blue-600 font-semibold ml-1">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
