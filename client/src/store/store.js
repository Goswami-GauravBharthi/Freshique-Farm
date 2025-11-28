// First, set up your Redux store with Redux Toolkit (RTK).
// Install necessary packages if not already: npm install @reduxjs/toolkit react-redux

// src/store.js
import { configureStore } from "@reduxjs/toolkit";
// import productsReducer from "./productSlice.js";
import filtersReducer from "./filterSlice.js";
import authReducer from "./authSlice.js";
import cartReducer from "./cartSlice.js"

export const store = configureStore({
  reducer: {
    // products: productsReducer,
    filters: filtersReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});
