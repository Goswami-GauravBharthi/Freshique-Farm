import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  add_to_cart,
  get_cart_data,
  remove_to_cart,
  update_cart_data,
} from "../Controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, add_to_cart);
cartRouter.post("/remove", authMiddleware, remove_to_cart);
cartRouter.get("/get-cart", authMiddleware, get_cart_data);
cartRouter.post("/update-cart", authMiddleware,update_cart_data);

export default cartRouter;
