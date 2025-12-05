// src/components/SearchFilterBar.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  setSearchQuery,
  setCity,
  setCategory,
  setMinPrice,
  setMaxPrice,
  resetFilters,
} from "../../store/filterSlice.js";

// Defined outside component to keep reference stable (Optimization)
const CITIES = ["Bhavnagar"];
const CATEGORIES = ["Fruits", "Vegetables", "Dairy", "Grains"];

const SearchFilterBar = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // specific selector to avoid unnecessary re-renders if other state changes
  const { searchQuery, city, category, minPrice, maxPrice } = useSelector(
    (state) => state.filters
  );

  const urlCategory = searchParams.get("category");

  // Capitalize function for category display
  const capitalize = useCallback((str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  }, []);

  // Sync URL category to Redux on changes
  useEffect(() => {
    if (
      urlCategory &&
      urlCategory.toLowerCase() !== (category || "").toLowerCase()
    ) {
      const titleCategory = capitalize(urlCategory);
      dispatch(setCategory(titleCategory));
    }
  }, [urlCategory, category, dispatch, capitalize]);

  // --- 1. Local State for Debouncing ---
  // We keep local state so the input updates instantly (UI feels fast),
  // but we only send data to Redux when the user stops typing.
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // --- 2. Sync Logic (Handle "Reset Filters" button) ---
  // If the Redux state changes externally (like clicking Reset), update local state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalMinPrice(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMaxPrice(maxPrice);
  }, [maxPrice]);

  // --- 3. Debounce Logic (The Performance Fix) ---

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only dispatch if value is different to avoid loops
      if (localSearch !== searchQuery) {
        dispatch(setSearchQuery(localSearch));
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(handler);
  }, [localSearch, dispatch, searchQuery]);

  // Debounce Min Price
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localMinPrice !== minPrice) {
        dispatch(setMinPrice(localMinPrice));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localMinPrice, dispatch, minPrice]);

  // Debounce Max Price
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localMaxPrice !== maxPrice) {
        dispatch(setMaxPrice(localMaxPrice));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localMaxPrice, dispatch, maxPrice]);

  // --- 4. Handlers (Memoized) ---

  const handleCityChange = useCallback(
    (e) => {
      dispatch(setCity(e.target.value));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (e) => {
      const newCategory = e.target.value;
      dispatch(setCategory(newCategory));
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newCategory === "") {
          newParams.delete("category");
        } else {
          newParams.set("category", newCategory.toLowerCase());
        }
        return newParams;
      });
    },
    [dispatch, setSearchParams]
  );

  const handleReset = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("category");
      return newParams;
    });
    dispatch(resetFilters());
    // Local state will be reset by the useEffect hooks above
  }, [dispatch, setSearchParams]);

  return (
    <div className="sm:block w-full mt-2 p-4">
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              // Bind to local state for instant feedback
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
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
              onChange={handleCityChange}
              className="w-full md:w-48 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 transition-all duration-300 shadow-sm text-gray-600 font-medium"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
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
              onChange={handleCategoryChange}
              className="w-full md:w-48 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 transition-all duration-300 shadow-sm text-gray-800 font-medium"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
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
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="w-full md:w-24 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 placeholder-gray-400 text-sm font-medium transition-all duration-300 shadow-sm"
          />
          <span className="self-center text-gray-500 hidden md:block font-semibold">
            —
          </span>
          <input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="w-full md:w-24 p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-500 placeholder-gray-400 text-sm font-medium transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full md:w-auto px-6 py-3 bg-linear-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-rose-500/30 transform hover:-translate-y-0.5"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

// Memoize the whole component to prevent re-renders from parent
export default React.memo(SearchFilterBar);
