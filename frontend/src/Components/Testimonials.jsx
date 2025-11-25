export default function Testimonials() {
  return (
    <div className="px-8 md:px-20 py-16 text-center">
      <h2 className="text-3xl font-bold dark:text-white">What Our Customers Say</h2>
      <p className="text-gray-500 dark:text-gray-300 mt-2">Trusted by 10,000+ users</p>

      <div className="mt-10 bg-white dark:bg-[#111827] rounded-3xl p-8 mx-auto max-w-3xl shadow-lg">
        <p className="text-lg dark:text-gray-200">
          “Super fast delivery and fresh quality groceries. Absolutely love the service!”
        </p>
        <h4 className="mt-4 font-bold text-green-600 dark:text-green-300">— Ankit Sharma</h4>
      </div>
    </div>
  );
}
