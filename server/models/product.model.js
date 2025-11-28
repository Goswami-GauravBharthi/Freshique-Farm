import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String, // e.g., 'fruits', 'vegetables', 'dairy'
      required: true,
    },
    photos: {
      type: Array,
      required: true,
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String, // e.g., 'kg', 'liters', 'pieces'
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: {
        city: String,
      },
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

