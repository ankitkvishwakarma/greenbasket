import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const totalPrice = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  async function handleCheckout() {
    try {
      const res = await API.post("/orders/checkout", {
        paymentStatus: "PAID",
      });

      console.log("Order:", res.data.order);

      alert("Order placed successfully!");
      localStorage.removeItem("cart");

      navigate("/my-orders");

    } catch (error) {
      console.log(error);
      alert("Order failed");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.map((item) => (
        <div key={item._id}>
          <p>{item.name} x {item.quantity}</p>
          <p>₹{item.price * item.quantity}</p>
        </div>
      ))}

      <h3>Total: ₹{totalPrice}</h3>

      <button
        onClick={handleCheckout}
        style={{ padding: "10px 20px", background: "green", color: "#fff" }}
      >
        Pay ₹{totalPrice}
      </button>
    </div>
  );
}
