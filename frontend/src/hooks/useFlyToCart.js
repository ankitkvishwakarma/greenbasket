// src/hooks/useFlyToCart.js
import { useRef } from "react";

export function useFlyToCart() {
  const flyRef = useRef(null);
  const cartRef = useRef(null);

  const flyToCart = (imgSrc, startPos) => {
    if (!cartRef.current) return;

    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.position = "fixed";
    img.style.left = startPos.x + "px";
    img.style.top = startPos.y + "px";
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.borderRadius = "12px";
    img.style.zIndex = 9999;
    img.style.transition = "all 0.9s cubic-bezier(0.32, 0.72, 0, 1)";
    document.body.appendChild(img);

    const cartRect = cartRef.current.getBoundingClientRect();

    setTimeout(() => {
      img.style.left = cartRect.left + "px";
      img.style.top = cartRect.top + "px";
      img.style.width = "10px";
      img.style.height = "10px";
      img.style.opacity = "0.3";
    }, 50);

    setTimeout(() => {
      img.remove();
      cartRef.current.classList.add("animate-bounce");
      setTimeout(() => cartRef.current.classList.remove("animate-bounce"), 500);
    }, 900);
  };

  return { flyRef, cartRef, flyToCart };
}
