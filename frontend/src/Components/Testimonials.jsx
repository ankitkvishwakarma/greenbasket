import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("http://localhost:5000/api/testimonials");
        if (!res.ok) {
          setTestimonials([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setTestimonials(data);
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  if (loading)
    return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto my-14 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Our Customers Say
      </h2>

      {testimonials.length === 0 ? (
        <p className="text-center text-gray-500">
          No testimonials available.
        </p>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-6
          "
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.12,
                ease: "easeInOut",   // NO BOUNCE
              }}
              viewport={{ once: true }}
              className="
                p-6 rounded-2xl bg-white dark:bg-gray-800 
                shadow-lg border border-green-100 
                dark:border-gray-700 
                hover:shadow-xl transition-all duration-200
              "
            >
              {/* Avatar + Name + Stars */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    item.avatar ||
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                  }
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>

                  <div className="flex text-yellow-400 text-lg">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                “{item.message}”
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
