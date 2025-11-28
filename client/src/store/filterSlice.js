// src/features/filters/filtersSlice.js
// This slice handles filter state for city, category, price, and search query.

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  city: "",
  category: "",
  minPrice: "",
  maxPrice: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setCity,
  setCategory,
  setMinPrice,
  setMaxPrice,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
