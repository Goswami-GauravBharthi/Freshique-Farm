// routes/blogRoutes.js
import express from "express";
import {
  createBlog,
  getMyBlogs,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
} from "../Controllers/blog.controller.js";
import authMiddleware, { authFarm } from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/", authMiddleware, authFarm, createBlog);
blogRouter.get("/myblogs", authMiddleware, authFarm, getMyBlogs);
blogRouter.delete("/:id", authMiddleware, authFarm, deleteBlog);


blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/:id/like", authMiddleware, likeBlog);
export default blogRouter;
