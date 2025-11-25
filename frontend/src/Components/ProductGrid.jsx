// ProductGrid.jsx
import { useFlyToCart } from "../hooks/useFlyToCart";

export default function ProductGrid() {
  const { flyToCart } = useFlyToCart();

  const products = [
    { name: "Fresh Tomatoes", price: "$2.99", img: "/mnt/data/tomato.png" },
    { name: "Bananas", price: "$1.49", img: "/mnt/data/banana.png" },
    { name: "Milk", price: "$3.29", img: "/mnt/data/milk.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" },
    { name: "Capsicum", price: "$2.59", img: "/mnt/data/capsicum.png" }
  ];

  const handleAdd = (e, img) => {
    const rect = e.target.getBoundingClientRect();
    flyToCart(img, { x: rect.left, y: rect.top });
  };

  return (
    <div className="px-8 md:px-20 py-16">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Popular Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {products.map((p, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] p-5 rounded-2xl shadow-lg"
          >
            <img src={p.img} className="w-28 mx-auto" />
            <h3 className="mt-3 font-semibold dark:text-white">{p.name}</h3>
            <p className="text-green-600 font-bold">{p.price}</p>

            <button
              onClick={(e) => handleAdd(e, p.img)}
              className="mt-4 w-full py-2 rounded-full bg-green-600 text-white"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
