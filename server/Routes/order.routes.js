import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getFarmerOrders,
  getTopFarmers,
  getUserOrders,
  placeOrder,
  updateOrderStatusByFarmer,
} from "../Controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/place-order", authMiddleware, placeOrder);

orderRouter.get("/user-orders", authMiddleware, getUserOrders);

orderRouter.get("/farmer-orders", authMiddleware, getFarmerOrders);

orderRouter.patch(
  "/:orderId/status",
  authMiddleware,
  updateOrderStatusByFarmer
);
orderRouter.get("/top-farmers", getTopFarmers);

export default orderRouter;
