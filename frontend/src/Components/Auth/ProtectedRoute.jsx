// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const logged = localStorage.getItem("loggedIn");

//   return logged === "true" ? children : <Navigate to="/login" />;
// }
// uperwala backend ke liye hai



import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const logged = localStorage.getItem("loggedIn");

  return logged === "true" ? children : <Navigate to="/login" />;
}
