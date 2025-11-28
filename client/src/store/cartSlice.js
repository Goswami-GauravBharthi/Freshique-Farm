// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apis/api";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const { data } = await api.get("cart/get-cart");
  return data;
});

export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  const { data } = await api.post("/cart/add", { product });
  return data;
});

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }) => {
    const { data } = await api.post("/cart/update-cart", {
      productId,
      quantity,
    });
    return data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    await api.post("/cart/remove", { productId });
    return productId;
  }
);

// Initial State
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    addDeliveryCharge:(state,action)=>{
         state.deliverCharge = action.payload;
        
    }
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add to Cart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      let existing;
      if (!action.payload.success) {
        state.error = action.payload.message;
      }
      if (state.cartItems) {
        existing = state.cartItems.find(
          (item) => item.productId === action.payload.cartItems.productId
        );
        if (existing) {
          existing.quantity += 1;
        } else {
          state.cartItems.push(action.payload.cartItems);
        }
      }
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.error = action.payload.data.response.error;
    });

    // Update Quantity
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
    });

    //Remove from Cart
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
    });
  },
});

export const { addTotalAmount, addDeliveryCharge } = cartSlice.actions;

export default cartSlice.reducer;
