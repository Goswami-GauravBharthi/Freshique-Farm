import { useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import { fetchProductsByCategory } from "../../apis/api";
import "./CategorySliders.css";

// 1. Memoized Product Card: Extracted to prevent re-creation on every render
// Switched from framer-motion to CSS hover for mobile performance
const ProductCard = memo(({ product, onClick }) => {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer 
                 transition-transform duration-300 ease-out hover:-translate-y-2 active:scale-95 will-change-transform"
      onClick={() => onClick(product._id)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100">
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async" // Prevents UI freeze during image decoding
        />
        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Fresh
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm text-center line-clamp-2 leading-tight min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="flex justify-center items-center">
          <div>
            <span className="text-xl font-bold text-emerald-600">
              ₹{product.pricePerUnit}
            </span>
            <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

// 2. Memoized Section: Handles the slider logic separately
const CategorySection = memo(({ category, idx, onProductClick }) => {
  // Static breakpoints object to avoid recreation
  const breakpoints = useMemo(
    () => ({
      480: { slidesPerView: 2.4 },
      640: { slidesPerView: 3.2 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
      1280: { slidesPerView: 6 },
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Better trigger point
      transition={{ duration: 0.6, delay: idx * 0.15 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent
            ${
              category.title.includes("Fruits")
                ? "bg-linear-to-r from-orange-600 via-red-600 to-pink-600"
                : category.title.includes("Vegetables")
                ? "bg-linear-to-r from-emerald-600 via-green-600 to-teal-700"
                : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700"
            }`}
        >
          {category.title}
        </h2>
        <div
          className={`h-1 w-20 mx-auto mt-3 bg-linear-to-r ${category.gradient} rounded-full`}
        />
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2.2}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // UX Improvement
        }}
        loop={category.items.length > 3}
        breakpoints={breakpoints}
        className="category-swiper py-4 px-2" // Added padding for shadow visibility
      >
        {category.items.length > 0 ? (
          category.items.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} onClick={onProductClick} />
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
  );
});

CategorySection.displayName = "CategorySection";

export default function CategorySliders() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products-by-category"],
    queryFn: fetchProductsByCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false, // Prevents jitters when switching tabs
  });

  // 3. Stable Navigation Handler
  const handleProductClick = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );

  // 4. Memoized Categories Array
  const categories = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Fresh Fruits",
        items: data.fruits || [],
        gradient: "from-orange-400 to-red-500",
      },
      {
        title: "Farm Vegetables",
        items: data.vegetables || [],
        gradient: "from-green-500 to-emerald-600",
      },
      {
        title: "Pure Dairy",
        items: data.dairy || [],
        gradient: "from-blue-400 to-indigo-600",
      },
    ];
  }, [data]);

  // Loading State
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error State
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
          <CategorySection
            key={cat.title}
            category={cat}
            idx={idx}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
    </section>
  );
}
