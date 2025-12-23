import { Router } from "express";



import { checkAuth, deleteFarmer, getAdminStats, getAllBlogs, getAllFarmers, getAllProducts, loginAdmin, logoutAdmin } from "../Controllers/admin.controller.js";
import { protectAdmin } from "../middleware/admin.middleware.js";


const adminRouter = Router();


adminRouter.post("/login", loginAdmin);

// Protected Routes 
adminRouter.post("/logout", protectAdmin, logoutAdmin);
adminRouter.get("/check-auth", protectAdmin, checkAuth);
adminRouter.delete("/farmers/:id",protectAdmin, deleteFarmer);

adminRouter.get("/stats", getAdminStats);

adminRouter.get("/farmers", getAllFarmers);
adminRouter.get("/products", getAllProducts);
adminRouter.get("/blogs", getAllBlogs);
export default adminRouter;