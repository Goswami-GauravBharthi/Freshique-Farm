import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Extract token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const tokenFromCookie = req.cookies?.token;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res
        .json({success:false, message: "Unauthorized: No token provided" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // 3️⃣ Attach user info to request
    req.user = {
      _id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      avatar: decoded.avatar,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid or expired token" });
  }
};

export const authFarm = async (req, res, next) => {
  try {
    if (req.user.role !== "farmer") {
      res.json({ success: false, message: "You are not Farmer" });
    }
    next();
  } catch (error) {
    console.error("Auth error:", err);
    res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token", success: false });
  }
};

export default authMiddleware;
