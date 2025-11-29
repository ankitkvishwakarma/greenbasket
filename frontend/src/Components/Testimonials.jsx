import { useEffect, useState } from "react";

export default function Testimonials() {

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/testimonials") // API Call
      .then(res => res.json())
      .then(data => setTestimonials(data));
  }, []);

  return (
    <div className="px-8 md:px-20 py-16 text-center">
      
      <h2 className="text-3xl font-bold dark:text-white">What Our Customers Say</h2>
      <p className="text-gray-500 dark:text-gray-300 mt-2">
        Trusted by {testimonials.length}+ users
      </p>

      {testimonials.length > 0 ? (
        <div className="mt-10 space-y-6 max-w-3xl mx-auto">
          
          {testimonials.map((item) => (
            <div 
              key={item._id}
              className="bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-lg"
            >
              <p className="text-lg dark:text-gray-200">“{item.message}”</p>
              <h4 className="mt-4 font-bold text-green-600 dark:text-green-300">
                — {item.name}
              </h4>
            </div>
          ))}

        </div>
      ) : (
        <p className="mt-6 text-gray-500 dark:text-gray-400">Loading...</p>
      )}

    </div>
  );
}
