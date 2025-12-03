import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-semibold text-green-600">🎉 Account Created Successfully</h1>
      <p className="text-gray-600 mt-2">Please login to continue.</p>

      <Link
        to="/login"
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Continue to Login
      </Link>
    </div>
  );
}
