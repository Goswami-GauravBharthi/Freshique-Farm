import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import fs from "fs/promises";

export const product_add = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantityAvailable,
      unit,
      pricePerUnit,
    } = req.body;

    // Validate required fields
    if (!name || !category || !quantityAvailable || !unit || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Handle photos: photo0, photo1, photo2, photo3
    const photo0 = req.files.photo0?.[0];
    const photo1 = req.files.photo1?.[0];
    const photo2 = req.files.photo2?.[0];
    const photo3 = req.files.photo3?.[0];

    const images = [photo0, photo1, photo2, photo3].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Upload to Cloudinary
    const imageUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        // Delete local file
        try {
          await fs.unlink(item.path);
        } catch (err) {
          console.error(`Error deleting file ${item.path}:`, err);
        }

        return result.secure_url;
      })
    );

    const farmer = await User.findById(req.user._id);
    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    // Create product
    const product = new Product({
      farmer: req.user._id,
      name: name.trim(),
      description: description?.trim(),
      category: category.trim(),
      photos: imageUrl,
      quantityAvailable: Number(quantityAvailable),
      unit: unit.trim(),
      pricePerUnit: Number(pricePerUnit),
      location: {
        city: farmer.location.city,
      },
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Product add error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const get_all_products = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate({ path: "farmer", select: "fullName email" });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const get_products_farmer = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({
      createdAt: -1,
    });
    if (!products) {
      return res.json({ message: "No products found", success: false });
    }
    res.json({ success: true, products });
  } catch (error) {
    return res.json({ message: "Internal server error", success: false });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const farmerId = req.user._id; 
    // Find the product
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user is the farmer/owner
    if (product.farmer.toString() !== farmerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

export const get_single_product = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the main product
    // Optimization: Populate only necessary farmer public fields
    const product = await Product.findById(id).populate(
      "farmer",
      "fullName profilePicture location role"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 2. Fetch Related Products (Suggestion System)
    // Logic: Same category, excluding the current product ID
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // Exclude current product
    })
      .select("name pricePerUnit unit photos category") // Optimization: Select only needed fields
      .limit(4); // Optimization: Limit to 4 items to reduce load

    return res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const getProductsByCategory = async (req, res) => {

  try {
    const products = await Product.find({
      quantityAvailable: { $gt: 0 },
      category: { $in: ["fruits", "vegetables", "dairy"] },
    })
      .select("name pricePerUnit unit photos category")
      .sort({ createdAt: -1 })
      .limit(18) // 6 × 3 = 18 max
      .lean(); // Faster: returns plain JS objects

    // Group manually (super fast in JS)
    const grouped = {
      fruits: [],
      vegetables: [],
      dairy: [],
    };

    const counts = { fruits: 0, vegetables: 0, dairy: 0 };

    for (const p of products) {
      if (counts[p.category] < 6) {
        grouped[p.category].push({
          _id: p._id,
          name: p.name,
          pricePerUnit: p.pricePerUnit,
          unit: p.unit,
          image: p.photos?.[0] || "/default.jpg",
        });
        counts[p.category]++;
      }
    }

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error hello" });
  }
};
