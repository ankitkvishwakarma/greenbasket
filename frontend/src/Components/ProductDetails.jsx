import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { increaseCount } = useCart();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
      setActiveImage(data.product.images?.[0]);
      loadSimilar(data.product.category, data.product._id);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadSimilar(category, excludeId) {
    try {
      const { data } = await API.get(`/products`);
      const filtered = data.products.filter(
        (p) => p.category === category && p._id !== excludeId
      );
      setSimilar(filtered);
    } catch (err) {
      console.log(err);
    }
  }

  async function addToCart() {
    await API.post("/cart/add", { productId: product._id });
    increaseCount(1);
  }

  if (!product)
    return <div className="p-12 text-center text-xl dark:text-white">Loading...</div>;

  return (
    <div className="pt-24 px-6 md:px-16 pb-12 dark:text-white">

      {/* ======================= PRODUCT SECTION ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT IMAGES */}
        <div>
          <div className="relative">
            <img
              src={activeImage}
              onClick={() => setZoom(true)}
              className="w-full h-[350px] object-contain rounded-xl shadow-md cursor-pointer
                         bg-white dark:bg-[#1c2335] p-4"
            />
            <p className="text-center text-sm mt-2 text-gray-400 dark:text-gray-300">
              Click image to zoom
            </p>
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 object-contain rounded-md cursor-pointer border
                  ${activeImage === img ? "border-green-600" : "border-gray-300"}
                  bg-white dark:bg-[#111827]`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <p className="text-4xl font-bold text-green-600">
            ₹{product.price}
          </p>

          {product.discount > 0 && (
            <p className="text-yellow-500 font-medium">
              {product.discount}% Discount Available
            </p>
          )}

          <p className="text-gray-600 dark:text-gray-400">
            Category: <b>{product.category}</b>
          </p>

          <p className="text-gray-600 dark:text-gray-400">
            Stock Available: <b>{product.stock}</b>
          </p>

          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">★</span>
            ))}
            <span className="text-gray-500 text-sm">(4.7 Rating)</span>
          </div>

          <button
            onClick={addToCart}
            className="mt-5 bg-green-600 text-white py-3 px-6 rounded-full w-60
                     hover:bg-green-700 transition-all text-lg"
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>

      {/* ZOOM POPUP */}
      {zoom && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setZoom(false)}
        >
          <img
            src={activeImage}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* SIMILAR PRODUCTS */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>

        {similar.length === 0 && (
          <p className="text-gray-400 dark:text-gray-300">No similar items found.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {similar.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-white dark:bg-[#111827] p-5 rounded-xl shadow-lg hover:scale-105 
                         transform transition-all"
            >
              <img
                src={p.images?.[0]}
                className="w-full h-32 object-contain mb-3"
              />

              <p className="font-semibold dark:text-white">{p.name}</p>
              <p className="text-green-600 font-bold">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
