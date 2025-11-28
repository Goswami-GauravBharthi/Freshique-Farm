// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  unit: String,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    //   unique: true,
    //   required: true,
    },
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryCharge:{
        type:Number,
        default:0,
        required:true
    },
    shippingAddress: {
      address: String,
      fullName:String,
      area:String,
      phone:String,
      city: String,
      pin_code: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
  },
  { timestamps: true }
);

// Auto generate readable order ID like ORD-20251120-001
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    this.orderId = `ORD-${date}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "items.productId": 1, createdAt: -1 });
orderSchema.index({ farmer: 1, createdAt: -1 });
orderSchema.index({ paymentMethod: 1, status: 1 });

// Bonus useful indexes
orderSchema.index({ farmer: 1 });
orderSchema.index({ consumer: 1 });
orderSchema.index({ orderId: 1 }, { unique: true }); // if orderId is unique

export const Order = mongoose.model("Order", orderSchema);
