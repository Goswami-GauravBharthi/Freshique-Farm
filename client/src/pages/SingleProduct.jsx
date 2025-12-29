import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ChevronRight,
  MapPin,
  ArrowRight,
  Star,
  Store,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../store/cartSlice";
import { fetchSingleProduct } from "../apis/api";
import ProductDescription from "../utils/ProductDescription";
import { playSound } from "../utils/sound";

export default function ProductDetail() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImg(0);
  }, [id]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchSingleProduct(id)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data?.success)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 font-medium text-lg">
        Product not found
      </div>
    );

  const { product, relatedProducts } = data;

  const handleAddToCart = (item = product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    // Handle both direct product add and related product add
    const cartItem = {
      productId: item._id,
      name: item.name,
      price: item.pricePerUnit.toFixed(2),
      unit: item.unit,
      quantity: 1,
      image: item.photos[0],
      farmerId: item.farmer._id || item.farmer,
    };
    dispatch(addToCart(cartItem));
    dispatch(fetchCart());
    toast.success(`${item.name} added to cart!`);
    playSound();
  };

  const goToFarmer = () => {
    navigate(`/farmerPage/${product.farmer._id}`);
  };

  const productCity = product.location?.city || "India";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- Breadcrumb Navigation --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-hidden">
            <NavLink
              to="/market"
              className="hover:text-green-600 shrink-0 transition-colors"
            >
              Market
            </NavLink>
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />
            <NavLink
              to={`/market?category=${product.category}`}
              className="hover:text-green-600 capitalize shrink-0 transition-colors"
            >
              {product.category}
            </NavLink>
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* =========================================================
            SECTION 1: HERO (Images + Product Details + Farmer)
           ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT SIDE: IMAGES (Col Span 7) --- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square lg:aspect-4/3 group">
              <img
                src={product.photos[selectedImg]}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-contain p-2 sm:p-6 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                FRESH HARVEST
              </div>
            </div>

            {/* Thumbnails */}
            {product.photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.photos.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImg === i
                        ? "border-green-600 ring-2 ring-green-100 opacity-100"
                        : "border-transparent bg-white opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: DETAILS & FARMER (Col Span 5) --- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium">{productCity}, India</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-green-700">
                  ₹{product.pricePerUnit}
                </span>
                <span className="text-lg text-gray-400 font-medium">
                  / {product.unit}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 w-fit px-3 py-1 rounded-lg">
                <Leaf className="w-4 h-4" />
                <span>
                  In Stock: {product.quantityAvailable} {product.unit}
                </span>
              </div>
            </div>

            {/* Farmer Trust Card */}
            <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100">
              <div
                onClick={goToFarmer}
                className="bg-linear-to-r from-gray-50 to-white p-4 rounded-[20px] flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="relative">
                  <img
                    src={product.farmer.profilePicture}
                    alt={product.farmer.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Sold by
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.farmer.fullName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-green-600 transition-colors" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-green-200 active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 2: FULL WIDTH DESCRIPTION
           ========================================================= */}
        <div className="mt-16 lg:mt-24">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-green-500 rounded-full"></span>
              Product Description
            </h2>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="prose prose-green max-w-none text-gray-600 leading-relaxed">
                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 3: SUGGESTED PRODUCTS
           ========================================================= */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24 pb-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                You might also like
              </h2>
              <NavLink
                to="/market"
                className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                View Market <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="aspect-4/3 bg-white p-4 relative overflow-hidden">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Add Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="absolute bottom-3 right-3 bg-green-600 text-white p-2.5 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col border-t border-gray-50">
                    <p className="text-xs text-green-600 font-bold uppercase mb-1">
                      {item.category}
                    </p>
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-lg text-gray-900">
                        ₹{item.pricePerUnit}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        / {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Professional & Stable Skeleton
function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse bg-gray-50 min-h-screen">
      <div className="h-14 bg-white mb-8 border-b border-gray-200"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 bg-white rounded-3xl aspect-square shadow-sm"></div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-10 bg-gray-200 rounded-xl w-3/4"></div>
          <div className="h-32 bg-white rounded-3xl shadow-sm"></div>
          <div className="h-24 bg-white rounded-3xl shadow-sm"></div>
          <div className="h-16 bg-green-100 rounded-2xl w-full mt-8"></div>
        </div>
      </div>
    </div>
  );
}
