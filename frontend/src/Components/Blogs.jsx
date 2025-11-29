import SuperMarketBanner from "./SuperMarketBanner";

export default function BlogSection() {

  const blogs = [
    {
      id: 1,
      title: "Top 10 Healthy Vegetables You Should Add to Your Diet",
      desc: "Know why green vegetables are the best choice for a healthy lifestyle...",
      img: "/assets/banner/bannerimage (1).jpeg",
    },
    {
      id: 2,
      title: "How to Store Fruits to Keep Them Fresh Longer",
      desc: "Simple techniques that increase shelf life and maintain nutrition...",
      img: "/assets/banner/bannerimage (2).jpeg",
    },
    {
      id: 3,
      title: "Organic vs Hybrid: Which is Better For Health?",
      desc: "We compared nutrients, chemicals & growth process — results may surprise you!",
      img: "/assets/banner/bannerimage (3).jpeg",
    },
  ];

  return (
    <div className="px-8 md:px-20 py-16">

      <h2 className="text-3xl font-bold text-center dark:text-white">
        Our Latest Blog Posts
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
        Stay updated with food, health & nutrition tips
      </p>

      <SuperMarketBanner />
      <div className="grid md:grid-cols-3 gap-8 mt-12">

        {blogs.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#111827] shadow-lg rounded-2xl overflow-hidden hover:scale-[1.03] duration-300"
          >

            <img src={item.img} className="w-full h-48 object-cover" />

            <div className="p-5">
              <h3 className="text-xl font-semibold dark:text-white">
                {item.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                {item.desc}
              </p>

              <button className="mt-4 text-green-600 dark:text-green-400 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
