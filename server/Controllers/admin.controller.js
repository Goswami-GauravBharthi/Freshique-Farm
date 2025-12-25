import jwt from "jsonwebtoken";

import { Blog } from "../models/blog.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    // Generate Token
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set Cookie
    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: true,
      sameSite: "none", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, isAuthenticated: true });
};

export const getAdminStats = async (req, res) => {
  try {
    // Execute all queries in parallel for faster response
    const [
      totalConsumers,
      totalFarmers,
      totalProducts,
      totalBlogs,
      totalOrders,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: "consumer" }),
      User.countDocuments({ role: "farmer" }),
      Product.countDocuments(),
      Blog.countDocuments(),
      Order.countDocuments(),
      // Fetch top 5 recent orders for a quick activity view
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("consumer", "fullName email")
        .select("orderId totalAmount status createdAt"),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalConsumers,
        totalFarmers,
        totalProducts,
        totalBlogs,
        totalOrders,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("fullName email phoneNumber location profilePicture createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: farmers.length, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching farmers" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name photos pricePerUnit unit category farmer")
      .populate("farmer", "fullName email") // Populate farmer details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    // We select authorName directly as per your schema, no need to populate if name is saved
    const blogs = await Blog.find()
      .select("title authorName createdAt image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs" });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if user exists and is actually a farmer before deleting
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "farmer") {
      return res.status(400).json({ message: "User is not a farmer" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Farmer deleted successfully" });
  } catch (error) {
    console.error("Error deleting farmer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
