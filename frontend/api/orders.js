import API from "./axios";

// GET ALL ORDERS (ADMIN)
export const getAllOrders = () => API.get("/orders");

// GET TODAY ORDERS
export const getTodayOrders = () => API.get("/orders/today");

// GET SALES REPORT
export const getSales = () => API.get("/orders/sales");
