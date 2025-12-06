export function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exist = cart.find(item => item._id === product._id);

  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
}
