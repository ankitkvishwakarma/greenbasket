import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";

export default function AdvancedBannerSlider() {

  const slides = [
    { img: "/assets/banner/bannerimage (1).jpeg", title: "Fresh Organic Vegetables", price: "₹129/kg" },
    { img: "/assets/banner/bannerimage (2).jpeg", title: "Healthy Green Salad Bowl", price: "₹199 Only" },
    { img: "/assets/banner/bannerimage (3).jpeg", title: "Premium Seasonal Veggies", price: "₹159/kg" },
    { img: "/assets/banner/bannerimage (5).jpeg", title: "Farm Fresh Basket Offer", price: "₹249 Pack" },
  ];

  return (
    <div className="w-full 
    h-[200px]        /* Mobile height reduced */
    md:h-[300px]     /* Tablet size */
    lg:h-[380px]     /* Desktop smooth smaller size */
    overflow-hidden">

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

              {/* 🔥 Smooth Zoom Animation */}
              <motion.div
                initial={{ scale: 1.18, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 4, ease: "easeOut" }}   // smoother movement
                style={{ backgroundImage: `url("${item.img}")` }}
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              />

              {/* 🔥 Soft Gradient Blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent"></div>

              {/* Text Section */}
              <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-14 text-white">

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-lg md:text-3xl font-bold drop-shadow-xl"
                >
                  {item.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: .4 }}
                  className="mt-1 text-sm md:text-lg bg-green-500/85 w-fit px-3 py-1 rounded-md font-semibold shadow-md"
                >
                  {item.price}
                </motion.p>

              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
}
