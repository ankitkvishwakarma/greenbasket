import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import banner from "../../public/assets/banner/bannerimage (1).jpeg"

export default function AdvancedBannerSlider() {

  const slides = [
    { img: {banner}, title: "Fresh Organic Vegetables", price: "₹129/kg" },
    { img: "/assets/banners/banner(2).jpg", title: "Healthy Green Salad Bowl", price: "₹199 Only" },
    { img: "/assets/banners/banner(3).jpg", title: "Premium Seasonal Veggies", price: "₹159/kg" },
    { img: "/assets/banners/banner(4).jpg", title: "Farm Fresh Basket Offer", price: "₹249 Pack" },
  ];

  return (
    <div className="w-full h-[290px] md:h-[380px] lg:h-[450px] overflow-hidden">

      <Swiper
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Navigation, Autoplay]}
        className="h-full"
      >

        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full relative overflow-hidden">

              {/* ⚡ Zoom Animated Background */}
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3 }}
                style={{ backgroundImage: `url(${item.img})` }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              />

              {/* 🎨 Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent"></div>

              {/* TEXT CONTENT */}
              <div className="relative z-10 h-full flex flex-col justify-center pl-8 md:pl-14 text-white">

                {/* ✨ Title with Animation */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl md:text-4xl font-bold drop-shadow-lg"
                >
                  {item.title}
                </motion.h1>

                {/* 💰 Price Tag */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: .4 }}
                  className="mt-2 text-lg bg-green-500/80 w-fit px-4 py-1 rounded-md font-semibold shadow-md"
                >
                  {item.price}
                </motion.p>

                {/* 🛒 CTA BUTTON */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .6 }}
                  className="mt-4 px-5 py-2 bg-white text-green-700 font-bold rounded-lg hover:bg-green-500 hover:text-white duration-300 shadow-lg"
                >
                  Shop Now 🛒
                </motion.button>

              </div>

            </div>
          </SwiperSlide>
        ))}

      </Swiper>

    </div>
  );
}
