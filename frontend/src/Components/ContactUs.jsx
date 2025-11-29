export default function ContactUs() {

  return (
    <div className="px-6 md:px-20 py-16">

      {/* Heading  */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-green-600 dark:text-green-400">Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          We'd love to hear from you. Reach out anytime!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* 📍 Left Contact Info */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">Our Details</h3>

          <p className="text-gray-600 dark:text-gray-300 mb-3">
            📍 Address: 123 Green Street, Grocery City, India
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            📞 Phone: +91 98765 43210
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            ✉ Email: support@greenbasket.in
          </p>

          <div className="mt-6">
            <iframe
              className="w-full h-56 rounded-xl border"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.10582407873!2d72.7410981!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c630462f7dfd%3A0x5e3a3b9e28430476!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1699262334562"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* 📝 Right Form */}
        <form className="bg-white dark:bg-[#111827] rounded-2xl p-8 shadow-lg space-y-6">

          <div>
            <label className="font-semibold dark:text-white">Full Name</label>
            <input type="text" placeholder="Enter your name"
              className="w-full mt-1 p-3 rounded-lg border dark:bg-[#0f1629] dark:text-white outline-none" />
          </div>

          <div>
            <label className="font-semibold dark:text-white">Email</label>
            <input type="email" placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-lg border dark:bg-[#0f1629] dark:text-white outline-none" />
          </div>

          <div>
            <label className="font-semibold dark:text-white">Phone Number</label>
            <input type="number" placeholder="Enter your phone number"
              className="w-full mt-1 p-3 rounded-lg border dark:bg-[#0f1629] dark:text-white outline-none" />
          </div>

          <div>
            <label className="font-semibold dark:text-white">Message</label>
            <textarea rows="4" placeholder="Write your message here..."
              className="w-full mt-1 p-3 rounded-lg border dark:bg-[#0f1629] dark:text-white outline-none" />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            Send Message
          </button>

        </form>
      </div>
    </div>
  );
}
