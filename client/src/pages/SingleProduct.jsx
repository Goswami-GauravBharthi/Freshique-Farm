import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleProduct } from "../apis/api";
import ProductDescription from "../utils/ProductDescription";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../store/cartSlice";

export default function ProductDetail() {

    const {user}=useSelector(state=>state.auth)
  const { id } = useParams();
  const dispatch=useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchSingleProduct(id),
  });
  if (isLoading) {
    return <LoadingSkeleton />;
  }


  const handleAddToCart = async () => {

    if(!user){
        toast.error("Please Login To add product on cart")
        return;
    }

    toast.success(`${data?.product.name} added to cart!`);
     const cartProduct = {
       productId: data?.product._id,
       name: data?.product.name,
       price: data?.product?.pricePerUnit.toFixed(2),
       unit: data?.product?.unit,
       quantity: 1,
       image: data?.product?.photos[0],
       farmerId: data?.product.farmer._id,
     };
  
    
        dispatch(addToCart(cartProduct));
        dispatch(fetchCart());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ---------- BREADCRUMB ---------- */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <NavLink to="/market" className="hover:text-green-600">
            Market
          </NavLink>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-green-600">
            {data?.product?.category}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{data?.product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ---------- IMAGE GALLERY ---------- */}
          <div className="order-1 lg:order-1">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={data?.product?.photos[selectedImg]}
                alt={data?.product?.name}
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-square"
              />
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                {10}% Off
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {data?.product?.photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImg === i
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${data?.product?.name} thumbnail ${i + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ---------- DETAILS ---------- */}
          <div className="order-2 lg:order-2 space-y-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {data?.product?.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-600">
                ₹{data?.product?.pricePerUnit.toFixed(2)}
              </span>
            </div>

            {/* Unit */}
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex w-20 h-8 bg-yellow-400 text-yellow-900 rounded-full items-center justify-center font-medium">
                {data?.product?.unit}
              </span>
              Size / Weight
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                // disabled={adding}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-6
                  rounded-full font-medium text-white transition-all cursor-pointer
                  bg-green-600
                `}
              >
                <ShoppingCart />
                Add to Cart
              </button>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-lg font-semibold mb-2">
                Product Description
              </h2>
              <ProductDescription description={data?.product?.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------
   Simple loading skeleton (optional)
   ----------------------------------------------------------------- */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-300 rounded-2xl h-96"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-20"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 h-12 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
