// src/pages/farmer/Profile.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Calendar,
  Package,
  MapPin,
  Star,
  Leaf,
  Trees,
  Sun,
  Droplets,
} from "lucide-react";
import { fetchFarmerProfile } from "../../apis/api";

const Profile = () => {
  const {
    data: farmer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["farmerProfile"],
    queryFn: fetchFarmerProfile,
  });

  if (isLoading) {
    return (
      <div className="flex items-center rounded-2xl justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl">
          <p className="text-red-600 text-xl font-semibold">
            Failed to load profile
          </p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const { fullName, email, phoneNumber, profilePicture, location, stats } =
    farmer;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl">
      {/* Subtle Farm SVG Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path
            d="M0 400 Q300 200 600 350 T1200 400 L1200 800 L0 800 Z"
            fill="#004030"
          />
          <circle cx="200" cy="300" r="80" fill="#10b981" />
          <circle cx="800" cy="250" r="100" fill="#10b981" />
          <circle cx="1000" cy="350" r="70" fill="#10b981" />
          <path d="M100 500 L150 450 L200 500 Z" fill="#16a34a" />
          <path d="M900 480 L950 430 L1000 480 Z" fill="#16a34a" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-linear-to-b from-sky-300 via-sky-100 to-white  p-8 md:p-12">
        
         
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-white">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-8 ring-white ring-opacity-30 shadow-2xl">
                <img
                  src={profilePicture}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-linear-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Active
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {fullName}
              </h1>
              <p className="text-xl text-green-200 mb-6 flex items-center justify-center md:justify-start gap-2">
                <Trees className="w-6 h-6" />
                Certified Freshique Producer
              </p>

              <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm md:text-base">
                <div className="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-5 py-3">
                  <Calendar className="w-6 h-6 text-green-300" />
                  <div>
                    <p className="text-green-500">Member Since</p>
                    <p className="font-bold text-lg text-gray-500">
                      {stats.memberSince}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-5 py-3">
                  <Package className="w-6 h-6 text-green-300" />
                  <div>
                    <p className="text-green-500">Products Listed</p>
                    <p className="font-bold text-2xl text-gray-500 text-center">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column - Personal & Location */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-green-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Full Name
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Email Address
                    </p>
                    <p className="text-lg text-gray-800 mt-1">{email}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Phone Number
                    </p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      {phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Joined Freshique
                    </p>
                    <p className="text-xl font-bold text-green-700 mt-1">
                      {new Date(stats.joinedDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Location Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-green-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Farm Location
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-green-300">
                  <p className="text-lg font-medium text-gray-700">
                    {location?.address || "Farm address not set yet"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {location?.city && (
                    <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl p-5 text-center transform hover:scale-105 transition">
                      <Droplets className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">City</p>
                      <p className="font-bold text-green-800">
                        {location.city}
                      </p>
                    </div>
                  )}
                  {location?.state && (
                    <div className="bg-linear-to-br from-emerald-100 to-teal-100 rounded-2xl p-5 text-center transform hover:scale-105 transition">
                      <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">State</p>
                      <p className="font-bold text-emerald-800">
                        {location.state}
                      </p>
                    </div>
                  )}
                  {location?.country && (
                    <div className="bg-linear-to-br from-teal-100 to-cyan-100 rounded-2xl p-5 text-center transform hover:scale-105 transition">
                      <Trees className="w-8 h-8 text-teal-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Country</p>
                      <p className="font-bold text-teal-800">
                        {location.country}
                      </p>
                    </div>
                  )}
                  {location?.zipCode && (
                    <div className="bg-linear-to-br from-cyan-100 to-blue-100 rounded-2xl p-5 text-center transform hover:scale-105 transition">
                      <Leaf className="w-8 h-8 text-cyan-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">ZIP Code</p>
                      <p className="font-bold text-cyan-800">
                        {location.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            {/* Producer Stats */}
            <div className="bg-linear-to-br from-[#004030] via-green-700 to-emerald-800 rounded-3xl shadow-2xl p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-600 opacity-20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500 opacity-20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-10 flex items-center gap-3">
                  <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur">
                    <Star className="w-8 h-8 text-green-500" />
                  </div>
                  Producer Stats
                </h3>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-3">
                      {stats.totalProducts}
                    </div>
                    <p className="text-green-200 text-lg">Products Listed</p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                    <p className="text-green-600 font-semibold">Active Since</p>
                    <p className="text-2xl font-bold text-gray-500">{stats.memberSince}</p>
                  </div>

                  <div className="bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-center">
                    <p className="text-2xl font-bold">Verified Producer</p>
                    <p className="text-green-100 text-sm mt-2">
                      Trusted by Freshique
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Community Rating</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-bold text-green-600">
                      4.9
                    </span>
                    <span className="text-2xl text-gray-600">/ 5.0</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < 5
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Based on sales & feedback
                  </p>
                </div>
                <div className="p-6 bg-linear-to-br from-yellow-400 to-amber-500 rounded-3xl shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
