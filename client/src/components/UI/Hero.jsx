import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import { fetchProductsByCategory } from "../../apis/api";
import "./CategorySliders.css";


export default function CategorySliders() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products-by-category"],
    queryFn: fetchProductsByCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const categories = [
    {
      title: "Fresh Fruits",
      items: data?.fruits || [],
      gradient: "from-orange-400 to-red-500",
    },
    {
      title: "Farm Vegetables",
      items: data?.vegetables || [],
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Pure Dairy",
      items: data?.dairy || [],
      gradient: "from-blue-400 to-indigo-600",
    },
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error State (optional)
  if (isError) {
    return (
      <div className="py-20 text-center text-red-600">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <section className="bg-linear-to-b from-lime-50 via-white to-lime-50 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="text-center">
              <h2
                className={`text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent
                  ${
                    cat.title.includes("Fruits")
                      ? "bg-linear-to-r from-orange-600 via-red-600 to-pink-600"
                      : cat.title.includes("Vegetables")
                      ? "bg-linear-to-r from-emerald-600 via-green-600 to-teal-700"
                      : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700"
                  }`}
              >
                {cat.title}
              </h2>
              <div
                className={`h-1 w-20 mx-auto mt-3 bg-linear-to-r ${cat.gradient} rounded-full`}
              />
            </div>

            {/* Swiper */}
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={2.2}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={cat.items.length > 3}
              breakpoints={{
                480: { slidesPerView: 2.4 },
                640: { slidesPerView: 3.2 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="category-swiper"
            >
              {cat.items.length > 0 ? (
                cat.items.map((product) => (
                  <SwiperSlide key={product._id}>
                    {/* Clickable Card */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)} // Redirect on click
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100">
                        <img
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Fresh
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-gray-800 text-sm text-center line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex justify-center items-center">
                          <div>
                            <span className="text-xl font-bold text-emerald-600">
                              ₹{product.pricePerUnit}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              /{product.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="text-center py-10 text-gray-400">
                    No products yet
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </motion.div>
        ))}
      </div>

     
    </section>
  );
}
