import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Blog } from "../models/blog.model.js";

import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Register
export const register = async (req, res) => {
  try {
    const { email, password, role, fullName, phoneNumber, location } = req.body;

    if (
      !email ||
      !password ||
      !role ||
      !fullName ||
      !phoneNumber ||
      !location
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePicture;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        profilePicture = result.secure_url; // Store Cloudinary URL

        // Delete the local file
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.error(`Error deleting file ${req.file.path}:`, err);
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Optionally delete the local file even on Cloudinary failure
        await fs
          .unlink(req.file.path)
          .catch((err) => console.error("Failed to delete local file:", err));
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
        });
      }
    }

    // Hash password
    const hashedPassword = await User.hashPassword(password);

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      fullName,
      phoneNumber,
      profilePicture,
      location: JSON.parse(location),
    });

    await newUser.save();

    // Set JWT in httpOnly cookie
    setAuthCookie(res, newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (role === "farmer" && user.role !== "farmer") {
      return res
        .status(400)
        .json({ success: false, message: "You are not Farmer" });
    }

    // Compare password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Set JWT in httpOnly cookie
    setAuthCookie(res, user);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    clearAuthCookie(res);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
//   console.log(user)
  if (user) {
    res.json({ success: true, user });
  }
  res.end();    
};

export const getFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Fetch farmer with location
    const farmer = await User.findById(farmerId).select("-password -cartItems");

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    // Count total products
    const totalProducts = await Product.countDocuments({ farmer: farmerId });

    // Optional: You can add average rating later when reviews are added
    const stats = {
      totalProducts,
      joinedDate: farmer.createdAt,
      memberSince: new Date(farmer.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };

    res.status(200).json({
      success: true,
      data: {
        ...farmer.toObject(),
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerProfileForUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid farmer ID" });
    }

    const farmer = await User.findById(id)
      .select("-password -cartItems -__v")
      .lean();

    if (!farmer || farmer.role !== "farmer") {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    // Parallel fetch
    const [products, blogs, orders] = await Promise.all([
      Product.find({ farmer: id }).sort({ createdAt: -1 }).lean(),
      Blog.find({ author: id }).sort({ createdAt: -1 }).limit(6).lean(),
      Order.find({ farmer: id, paymentStatus: "paid" })
        .sort({ createdAt: -1 })
        .limit(50) // Increased for better stats
        .select("orderId totalAmount status createdAt items")
        .lean(),
    ]);

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;

    // Top selling products
    const productSalesMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const pid = item.productId.toString();
        productSalesMap[pid] = (productSalesMap[pid] || 0) + item.quantity;
      });
    });

    const topProducts = products
      .map((p) => ({
        ...p,
        soldCount: productSalesMap[p._id.toString()] || 0,
      }))
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 6);

    // Monthly growth calculation (fixed)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = thisMonthStart;

    const thisMonthOrders = orders.filter(
      (o) => new Date(o.createdAt) >= thisMonthStart
    );
    const lastMonthOrders = orders.filter(
      (o) =>
        new Date(o.createdAt) >= lastMonthStart &&
        new Date(o.createdAt) < lastMonthEnd
    );

    const monthlyGrowth =
      lastMonthOrders.length === 0
        ? thisMonthOrders.length > 0
          ? 100
          : 0
        : Math.round(
            ((thisMonthOrders.length - lastMonthOrders.length) /
              lastMonthOrders.length) *
              100
          );

    res.status(200).json({
      success: true,
      farmer: {
        ...farmer,
        stats: {
          totalOrders,
          deliveredOrders,
          monthlyGrowth:
            monthlyGrowth > 0 ? `+${monthlyGrowth}` : monthlyGrowth,
          rating: 4.9,
          totalProducts: products.length,
          totalBlogs: blogs.length,
          joinedDate: new Date(farmer.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        },
      },
      products,
      blogs,
      topProducts,
    });
  } catch (error) {
    console.error("getFarmerProfileForUser Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};