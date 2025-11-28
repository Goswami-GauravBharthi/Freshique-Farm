// src/components/SearchFilterBar.js
// Combined Search + Filters in a single horizontal, responsive bar

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  setCity,
  setCategory,
  setMinPrice,
  setMaxPrice,
  resetFilters,
} from "../../store/filterSlice.js";

const SearchFilterBar = () => {
  const dispatch = useDispatch();
  const { searchQuery, city, category, minPrice, maxPrice } = useSelector(
    (state) => state.filters
  );

  // Example options (customize based on your data)
  const cities = ["Bhavnagar"];
  const categories = ["Fruits", "Vegetables", "Dairy","Grains"];

  return (
    <div className=" sm:block w-full mt-2  p-4 ">
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 transition-all duration-300 shadow-sm placeholder:text-gray-400"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-3">
          {/* City Filter */}
          <div className="w-full md:w-auto">
            <select
              value={city}
              onChange={(e) => dispatch(setCity(e.target.value))}
              className="w-full md:w-48 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 transition-all duration-300 shadow-sm text-gray-600 font-medium"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="w-full md:w-48 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 transition-all duration-300 shadow-sm text-gray-800 font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => dispatch(setMinPrice(e.target.value))}
            className="w-full md:w-24 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 placeholder-gray-400 text-sm font-medium transition-all duration-300 shadow-sm"
          />
          <span className="self-center text-gray-500 hidden md:block font-semibold">
            —
          </span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => dispatch(setMaxPrice(e.target.value))}
            className="w-full md:w-24 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 placeholder-gray-400 text-sm font-medium transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={() => dispatch(resetFilters())}
          className="w-full md:w-auto px-6 py-3 bg-linear-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-rose-500/30 transform hover:-translate-y-0.5"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
