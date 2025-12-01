// components/TopFarmersSection.jsx
import React, { useMemo, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, ShoppingBag, MapPin, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTopFarmers } from "../../../apis/api";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Create static arrays outside component to prevent reallocation
const SKELETON_ARRAY = [...Array(5)];
const STARS_ARRAY = [...Array(5)];

// 1. Extract FarmerCard outside and wrap in memo to prevent unnecessary re-renders
const FarmerCard = memo(({ farmer, index, onNavigate }) => {
  return (
    <motion.div
      layout="position" // Optimize layout changes
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Better trigger for mobile
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative group cursor-pointer h-full"
      onClick={() => onNavigate(farmer.farmerId)}
    >
      {index < 3 && (
        <div className="absolute -top-3 -right-3 z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-xl ${
              index === 0
                ? "bg-linear-to-br from-yellow-400 to-orange-500"
                : index === 1
                ? "bg-linear-to-br from-gray-400 to-gray-600"
                : "bg-linear-to-br from-orange-600 to-red-700"
            }`}
          >
            <Trophy size={20} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform-gpu">
        <div className="relative">
          <img
            src={farmer.profilePicture}
            alt={farmer.fullName}
            loading="lazy" // Optimization for mobile data/loading
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-sm font-medium flex items-center gap-1">
              <ShoppingBag size={16} />
              {farmer.orderCount} Orders
            </p>
          </div>
        </div>

        <div className="p-5 text-center flex-1 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-800">
            {farmer.fullName.substring(0, 14)}
          </h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
            <MapPin size={14} />
            {farmer.location?.city}, {farmer.location?.state}
          </p>

          <div className="flex items-center justify-center gap-1 mt-3">
            {STARS_ARRAY.map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">Top Rated</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Display name for debugging
FarmerCard.displayName = "FarmerCard";

export default function TopFarmersSection() {
  const navigate = useNavigate();

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["top-farmers"],
    queryFn: fetchTopFarmers,
    staleTime: 1000 * 60 * 10,
    // Add keepPreviousData to prevent flashing during refetches
    placeholderData: (previousData) => previousData,
  });

  // 2. memoize the navigation handler
  const handleNavigate = useCallback(
    (id) => {
      navigate(`/farmerPage/${id}`);
    },
    [navigate]
  );

  // 3. Memoize the loading state UI
  const LoadingSkeleton = useMemo(() => {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SKELETON_ARRAY.map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full" />
                <div className="h-6 bg-gray-200 rounded mt-4 w-32 mx-auto" />
                <div className="h-4 bg-gray-200 rounded mt-2 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, []); // Empty dependency array as it never changes

  if (isLoading) {
    return LoadingSkeleton;
  }

  return (
    <section className="py-2 md:py-8 bg-linear-to-b from-lime-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-5xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Our Top Performing Farmers
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Meet the hardworking farmers trusted by thousands
          </p>
        </motion.div>

        {/* Mobile Swiper - Visible only on sm and below */}
        <div className="block sm:hidden my-5">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={farmers.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // Better UX
            }}
            pagination={{ clickable: true }}
            className="pb-10"
          >
            {farmers.map((farmer, index) => (
              <SwiperSlide key={farmer.farmerId}>
                <div className="px-4 h-full">
                  <FarmerCard
                    farmer={farmer}
                    index={index}
                    onNavigate={handleNavigate}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop/Tablet Grid - Hidden on mobile */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {farmers.map((farmer, index) => (
            <FarmerCard
              key={farmer.farmerId}
              farmer={farmer}
              index={index}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
