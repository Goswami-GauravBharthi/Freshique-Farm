import express from "express";
import cors from "cors";
import  "dotenv/config";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import connectCloudinary from "./config/cloudinary.js";

//? Router import
import authRouter from "./Routes/auth.routes.js";
import productRouter from "./Routes/product.routes.js";
import cartRouter from "./Routes/cart.routes.js";
import orderRouter from "./Routes/order.routes.js";
import analyticsRouter from "./Routes/analytics.routes.js";
import blogRouter from "./Routes/blog.routes.js";
import adminRouter from "./Routes/admin.routes.js";


//!==================== Database Connection==================================
await connectDb();
connectCloudinary();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigin = [process.env.ORIGIN, process.env.ORIGIN2];

//!=============================== Middleware================================

app.use(cors({ credentials: true, origin: allowedOrigin })); 
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

//*======================== Routes========================================== 

// Basic route for testing
app.get("/", (req, res) => {
  res.send("FreshiQue Farm Server is running");
});

app.use("/api/auth",authRouter);
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/analytics",analyticsRouter)
app.use("/api/blogs", blogRouter);
app.use("/api/admin", adminRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

