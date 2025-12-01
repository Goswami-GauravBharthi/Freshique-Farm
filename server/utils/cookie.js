// utils/cookie.js
import jwt from "jsonwebtoken";

export const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      name: user.fullName,
      avatar: user.profilePicture,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Force true in production
    sameSite: "none", // ← THIS FIXES IT
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // Add this
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",  // Must match exactly
    path: "/",         // Must match exactly
  });
};