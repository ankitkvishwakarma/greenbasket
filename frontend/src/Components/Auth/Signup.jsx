import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";

export default function Signup(){

  const navigate = useNavigate();
  const [fullname,setFullname] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function submitSignup(){
    const res = await fetch("http://localhost:5000/api/auth/signup",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        name: fullname,
        email,
        password
      })
    });

    if(res.ok){
      navigate("/signup-success");        // <-- NEW LINE
    } else {
      const err = await res.json();
      alert(err.message || "Signup failed");
    }
  }

  return (
    <AuthLayout title="Create Your Account">

      <input className="inputAuth" placeholder="Full Name"
      value={fullname} onChange={e=>setFullname(e.target.value)}/>

      <input className="inputAuth" placeholder="Email"
      value={email} onChange={e=>setEmail(e.target.value)}/>

      <input className="inputAuth" type="password" placeholder="Password"
      value={password} onChange={e=>setPassword(e.target.value)}/>

      <button className="btnBlue w-full" onClick={submitSignup}>Sign Up</button>

      <p className="text-sm mt-4 text-center">
        Already have an account?
        <Link to="/login" className="text-blue-600 font-semibold ml-1">Login</Link>
      </p>
    </AuthLayout>
  );
}
