import { Router } from "express";
import authMiddleware, { authFarm } from "../middleware/auth.middleware.js";
import {  getFarmerAnalytics } from "../Controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.get("/farmer", authMiddleware, authFarm, getFarmerAnalytics);

export default analyticsRouter;
