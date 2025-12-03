import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";

export default function AdminLogin(){

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function loginAdmin(){
    try{
      const res = await fetch("http://localhost:5000/api/admin/login",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ email, password })
      });

      const data = await res.json();

      if(res.ok){

        // SAVE TOKEN
        localStorage.setItem("token", data.token);

        // SAVE ADMIN INFO
        localStorage.setItem("user", JSON.stringify(data.admin));

        // MOST IMPORTANT ❗
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", "ADMIN");

        navigate("/admin/dashboard", { replace: true });
        window.location.reload();
      }
      else{
        alert(data.message || "Invalid admin credentials ❌");
      }
    }
    catch(err){
      alert("Server error!");
      console.log(err);
    }
  }

  return(
    <AuthLayout title="Admin Login Portal">

      <input className="inputAuth"
        placeholder="Admin Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <input className="inputAuth"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />

      <button className="btnBlue w-full" onClick={loginAdmin}>
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Not Admin?
        <Link to="/login" className="text-blue-600 font-semibold ml-1">User Login</Link>
      </p>

    </AuthLayout>
  );
}
