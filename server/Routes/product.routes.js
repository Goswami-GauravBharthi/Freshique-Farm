import { Router } from "express";
import authMiddleware, { authFarm } from "../middleware/auth.middleware.js";
import {
  get_all_products,
  get_products_farmer,
  get_single_product,
  getProductsByCategory,
  product_add,
} from "../Controllers/product.controller.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.post(
  "/add",
  authMiddleware,
  authFarm,
  upload.fields([
    { name: "photo0", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
    { name: "photo3", maxCount: 1 },
  ]),
  product_add
);

productRouter.get("/category", getProductsByCategory);

productRouter.get("/all-products", get_all_products);
productRouter.get(
  "/my-products",
  authMiddleware,
  authFarm,
  get_products_farmer
);

productRouter.get("/:id", get_single_product);




export default productRouter;
