// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  ShoppingBasketIcon,
  ShoppingBasket,
  Home,
  MessageCircleCode,
  ShoppingBag,

} from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Grains",
    "Organic",
  ];

  const handleUser = () => {
    if (user === null) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  // Inside your component
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper: Check if path is active
  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const newLocal =
    "w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-full p-1 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300";
  return (
    <>
      {/* Fixed Top Navbar  */}
      <header className="fixed py-4 top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-xl border-b border-emerald-100 rounded-b-4xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Same, but elevated */}
            <div className="flex items-center">
              <Link to="/">
                <img src="/logo.png" alt="" className="w-35  md:w-40" />
              </Link>
            </div>

            {/* About & Contact - Same */}
            <div className="flex gap-6">
              <Link
                to="/community"
                className="text-gray-600 flex gap-2 font-semibold text-base hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                <span className="hidden md:block">Community</span>
                <MessageCircleCode className="block " />
              </Link>
              <Link
                to="/my-orders"
                className="text-gray-600 flex gap-2 font-semibold text-base hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
               <span className="hidden md:block">My Orders</span>
                <span>
                  <ShoppingBag />
                </span>{" "}
              </Link>
            </div>

            {/* MARKET PLACE - Same */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/market"
                className="group  gap-2 text-gray-700 hover:text-emerald-600 transition-all duration-300"
              >
                <ShoppingBasketIcon className="w-6 h-6 mx-auto text-emerald-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-300" />
                <p className="font-bold text-emerald-700 group-hover:text-emerald-800 transition-all duration-300">
                  Market
                </p>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-300" />

                {cartItems && (
                  <span className="absolute -top-2 -right-2 bg-linear-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                    {cartItems?.length}
                  </span>
                )}
                <p className="font-bold text-emerald-700 group-hover:text-emerald-800 transition-all duration-300">
                  Cart
                </p>
              </Link>

              {/* Profile */}
              <button
                onClick={handleUser}
                className="p-1 rounded-full bg-emerald-300 cursor-pointer hover:bg-emerald-200 transition-all duration-300 group"
              >
                {user?.profilePicture ? (
                  <img
                    src={user?.profilePicture}
                    alt={user?.fullName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex p-1.5 items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-300" />
                    <span className="font-bold text-white">Login</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation - Premium Active State */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-emerald-100 z-50">
        <div className="flex justify-around items-stretch">
          {/* Home */}
          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
              isActive("/")
                ? "bg-linear-to-t from-emerald-600 to-emerald-500 text-white shadow-lg"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <Home
              className={`w-6 h-6 mb-1 ${isActive("/") ? "scale-110" : ""}`}
            />
            <span className="text-xs font-bold">Home</span>
          </Link>

          {/* Marketplace */}
          <Link
            to="/market"
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
              isActive("/market")
                ? "bg-linear-to-t from-emerald-600 to-emerald-500 text-white shadow-lg"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <ShoppingBasket
              className={`w-6 h-6 mb-1 ${
                isActive("/market") ? "scale-110" : ""
              }`}
            />
            <span className="text-xs font-bold">Market</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-all duration-300 ${
              isActive("/cart")
                ? "bg-linear-to-t from-emerald-600 to-emerald-500 text-white shadow-lg"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <div className="relative">
              <ShoppingCart
                className={`w-6 h-6 mb-1 ${
                  isActive("/cart") ? "scale-110" : ""
                }`}
              />
              {cartItems?.length > 0 && (
                <span
                  className={`absolute -top-2 -right-2 text-xs font-bold rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive("/cart")
                      ? "bg-white text-emerald-600 w-5 h-5"
                      : "bg-linear-to-br from-red-500 to-pink-500 text-white w-5 h-5"
                  }`}
                >
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-xs font-bold">Cart</span>
          </Link>

          {/* Profile / Login */}
          <button
            onClick={handleUser}
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
              isActive("/profile") || (user && currentPath.includes("/profile"))
                ? "bg-linear-to-t from-emerald-600 to-emerald-500 text-white shadow-lg"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.fullName}
                  className={`w-7 h-7 rounded-full object-cover ring-2 ${
                    isActive("/profile") ? "ring-white" : "ring-emerald-300"
                  }`}
                />
              ) : (
                <User
                  className={`w-6 h-6 ${
                    isActive("/profile") ? "scale-110" : ""
                  }`}
                />
              )}
            </div>
            <span className="text-xs font-bold mt-1">
              {user ? "Profile" : "Login"}
            </span>
          </button>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>
    </>
  );
}
