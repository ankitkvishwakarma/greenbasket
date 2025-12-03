import API from "./axios";

// 📌 Get All Products
export const getProducts = () => API.get("/products");

// 📌 Get Single Product
export const getSingleProduct = (id) => API.get(`/products/${id}`);

// 📌 Create New Product (ADMIN)
export const createProduct = (data) => API.post("/products/create", data);

// 📌 Update Product (ADMIN)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

// 📌 Delete Product (ADMIN)
export const deleteProduct = (id) => API.delete(`/products/${id}`);
