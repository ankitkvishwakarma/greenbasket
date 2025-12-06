import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", 
=======
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
>>>>>>> 7bd45fd (some bug fixed)
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
