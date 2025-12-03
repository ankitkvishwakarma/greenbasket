import { useEffect, useState } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("http://localhost:5000/api/testimonials");

        // If API not found → avoid crash
        if (!res.ok) {
          console.warn("Testimonials API returned:", res.status);
          setTestimonials([]);
          setLoading(false);
          return;
        }

        // Safe JSON parsing
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Testimonials Fetch Error:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say</h2>

      {testimonials.length === 0 ? (
        <p className="text-center text-gray-500">No testimonials available.</p>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl shadow bg-white border"
            >
              <p className="text-gray-700 text-lg">“{item.message}”</p>
              <p className="mt-2 text-sm font-semibold text-blue-600">
                — {item.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
