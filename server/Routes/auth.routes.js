// routes/auth.js
import { Router } from "express";
import {
  getFarmerProfile,
  getFarmerProfileForUser,
  getProfile,
  login,
  logout,
  register,
} from "../Controllers/auth.controller.js";
import authMiddleware, { authFarm } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const authRouter = Router();

authRouter.post("/register", upload.single("profilePicture"), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.get("/farmer-profile", authMiddleware, authFarm, getFarmerProfile);
authRouter.use("/farmer-profile-user/:id", getFarmerProfileForUser);

export default authRouter;
