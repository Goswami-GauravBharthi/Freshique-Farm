// controllers/blogController.js
import {Blog} from "../models/blog.model.js";

const createBlog = async (req, res) => {
  const { title, description, image } = req.body;

  try {
    if (!title || !description || !image) {
      res.status(400);
      throw new Error("Please fill all fields including image");
    }

    const blog = await Blog.create({
      title,
      description,
      image,
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    await blog.deleteOne();
    res.json({ message: "Blog removed" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "fullName profilePicture location role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "fullName profilePicture location phoneNumber")
      .lean();

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const userId = req.user._id; // assuming you have auth middleware setting req.user

    // Check if already liked
    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await blog.save();
      return res.json({
        success: true,
        liked: false,
        likesCount: blog.likes.length,
      });
    } else {
      // Like
      blog.likes.push(userId);
      await blog.save();
      return res.json({
        success: true,
        liked: true,
        likesCount: blog.likes.length,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { createBlog, getMyBlogs, deleteBlog };
