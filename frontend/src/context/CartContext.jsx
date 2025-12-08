import { createContext, useContext, useEffect, useState } from "react";
import API from "../../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);

  // BACKEND CART COUNT LOAD
  async function loadCartCount() {
    try {
      const { data } = await API.get("/cart");
      const items = data.cart?.items || [];
      const total = items.reduce((sum, i) => sum + i.quantity, 0);
      setCount(total);
    } catch (err) {
      console.log("Cart count load error:", err);
    }
  }

  // Increase when product added
  function increaseCount(q = 1) {
    setCount(prev => prev + q);
  }

  useEffect(() => {
    loadCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ count, increaseCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
