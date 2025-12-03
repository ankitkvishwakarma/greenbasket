import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";

export default function ForgotPassword(){

  const [email,setEmail] = useState("");

  async function sendLink(){
    await fetch("http://localhost:5000/api/auth/forgot-password",{
      method:"POST",headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email })
    });
    alert("Password reset link has been sent!");
  }

  return(
    <AuthLayout title="Forgot Password?">

      <input className="inputAuth" placeholder="Enter Email"
      value={email} onChange={e=>setEmail(e.target.value)}/>

      <button className="btnBlue w-full" onClick={sendLink}>Send Reset Link</button>

      <p className="text-sm mt-4 text-center">
        Back to 
        <Link to="/login" className="text-blue-600 font-semibold ml-1">Login</Link>
      </p>
    </AuthLayout>
  );
}
