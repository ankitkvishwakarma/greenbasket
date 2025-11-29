export default function OffersBanner() {
  return (
    <div className="px-8 md:px-20 py-16">
      
      <div 
        className="relative rounded-3xl overflow-hidden shadow-lg h-[220px] md:h-[300px] flex items-center justify-center"
        style={{ backgroundImage: `url("/assets/banner/bannerimage (7).jpeg")`, backgroundSize: "cover", backgroundPosition: "center" }}
      >

        {/* 🔥 Overlay Layer */}
        <div className="absolute inset-0 bg-black/40"></div> 
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>  // if gradient chahiye */}

        {/* TEXT CONTENT */}
        <div className="relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-xl">
            50% OFF on First Order
          </h2>
          <p className="mt-2 text-lg md:text-xl font-medium bg-green-500 px-5 py-1 rounded-full inline-block shadow-lg">
            Use Code: FIRST50
          </p>
        </div>

      </div>
    </div>
  );
}
