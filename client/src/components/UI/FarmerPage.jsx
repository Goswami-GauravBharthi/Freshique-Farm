// pages/FarmerPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  MapPin,
  Phone,
  Mail,
  Package,
  TrendingUp,
  Star,
  Shield,
  Leaf,
  Award,
  ArrowLeft,
  CheckCircle2,
  Wheat,
  Trees,
  Flower,
} from "lucide-react";
import { fetchFarmerProfileForUser } from "../../apis/api";

const FARM_TYPE_ICONS = {
  vegetables: <Leaf className="w-8 h-8" />,
  grains: <Wheat className="w-8 h-8" />,
  fruits: <Flower className="w-8 h-8" />,
  dairy: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-8 0H5"
      />
    </svg>
  ),
  default: <Trees className="w-8 h-8" />,
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="relative ">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-emerald-600 border-r-green-600 border-b-teal-600 border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700">
        Loading Farmer Profile...
      </p>
    </div>
  </div>
);

// Fixed Height Product Card
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.photos[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
          <p className="text-white font-medium">View Details →</p>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="font-bold text-gray-800 line-clamp-2 min-h-14">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 ">{product.category}</p>

        <div className="mt-4 flex items-end justify-between grow">
          <div>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{product.pricePerUnit}
              <span className="text-sm font-normal text-gray-500">
                /{product.unit}
              </span>
            </p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
            {product.quantityAvailable > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <Leaf className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700 font-medium">
            100% Organic
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Top Product Card (Best Selling)
const TopProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.photos[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            #{index + 1}
          </div>
        </div>
        <div className="p-3 text-center">
          <h4 className="font-semibold text-gray-800 line-clamp-1 text-sm">
            {product.name}
          </h4>
          <p className="text-xs text-gray-600 mt-1">{product.soldCount} sold</p>
        </div>
      </div>
    </motion.div>
  );
};

// Blog Card
const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group h-full flex flex-col"
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs font-medium">
            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3 grow">
          {blog.description}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <img
            src={blog.authorAvatar}
            alt={blog.authorName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {blog.authorName}
            </p>
            <p className="text-xs text-gray-500">Farmer & Blogger</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function FarmerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["farmer-profile", id],
    queryFn: () => fetchFarmerProfileForUser(id),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Farmer Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-linear-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const { farmer, products, blogs, topProducts } = data.data;

  return (
    <>
      {/* Modern Hero Section */}
      <section className="relative bg-orange-400/80 text-white py-16">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-medium"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="grid lg:grid-cols-3 gap-10 items-center">
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/30">
                  <img
                    src={farmer?.profilePicture}
                    alt={farmer?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-400 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Award size={18} /> Top Farmer
                </div>
              </div>

              <div className="mt-10 flex justify-center gap-4">
                <div className="bg-white/20 backdrop-blur p-4 rounded-2xl text-center">
                  <Shield className="mx-auto text-emerald-300" size={28} />
                  <p className="text-xs mt-1">Verified</p>
                </div>
                <div className="bg-white/20 backdrop-blur p-4 rounded-2xl text-center">
                  {FARM_TYPE_ICONS[farmer?.farmType] || FARM_TYPE_ICONS.default}
                  <p className="text-xs mt-1 capitalize">
                    {farmer?.farmType || "Farm"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold">
                  {farmer?.fullName}
                </h1>
                <p className="text-xl text-emerald-200 mt-2 flex items-center gap-2">
                  <MapPin size={22} />
                  {farmer?.location?.city}, {farmer?.location?.state}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md">
                {[
                  {
                    icon: Package,
                    value: farmer.stats.totalOrders,
                    label: "Orders",
                  },
                  {
                    icon: TrendingUp,
                    value: `${farmer.stats.monthlyGrowth}%`,
                    label: "Growth",
                  },
                  { icon: Star, value: "4.9", label: "Rating" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center"
                  >
                    <stat.icon
                      className="mx-auto text-yellow-300 mb-2"
                      size={32}
                    />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-90">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {farmer.phoneNumber && (
                  <a
                    href={`tel:${farmer.phoneNumber}`}
                    className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-xl hover:bg-white/30 transition"
                  >
                    <Phone size={18} /> {farmer.phoneNumber}
                  </a>
                )}
                <a
                  href={`mailto:${farmer.email}`}
                  className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-xl hover:bg-white/30 transition"
                >
                  <Mail size={18} /> Contact
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* Best Selling Products */}
      {topProducts?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Best Selling Products
            </h2>

            <div className="block lg:hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={2.2}
                pagination={{ clickable: true }}
              >
                {topProducts.map((p, i) => (
                  <SwiperSlide key={p._id}>
                    <TopProductCard product={p} index={i} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden lg:grid grid-cols-6 xl:grid-cols-8 gap-6">
              {topProducts.map((p, i) => (
                <TopProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-10  md:p-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            All Products ({products.length})
          </h2>

          {/* Mobile Swiper */}
          <div className="block md:hidden">
            <Swiper spaceBetween={16} slidesPerView={1.3} centeredSlides={true}>
              {products.map((p) => (
                <SwiperSlide key={p._id}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Blogs */}
      {blogs?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Farming Stories & Tips
            </h2>

            <div className="block md:hidden">
              <Swiper spaceBetween={20} slidesPerView={1.2}>
                {blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <BlogCard blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
