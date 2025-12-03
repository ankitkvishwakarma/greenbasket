import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const logged = localStorage.getItem("loggedIn");
  const role = localStorage.getItem("role");

  return (logged === "true" && role === "ADMIN")
    ? children
    : <Navigate to="/admin/login" />;
}
