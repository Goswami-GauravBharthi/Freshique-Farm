import axios from "axios";

// ? ==========================================================
// ? AXIOS CONFIGURATION
// ? ==========================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // Send cookies
});

// ? ========================= AUTHENTICATION APIs  =================================

export const registerUser = async (formData) => {
  try {
    const { data } = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const LoginUser = async (formData) => {
  try {
    const { data } = await api.post("/auth/login", formData);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await api.post("/auth/logout");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const changePassword = async ({ newPassword, confirmPassword }) => {
  try {
    const { data } = await api.patch("/auth/change-password", {
      newPassword,
      confirmPassword,
    });
    if (data.success) {
      return data;
    }
  } catch (error) {
    return error.response.data;
  }
};

// ? ======================   PRODUCT APIs (Public)  ====================================

export const fetchProducts = async () => {
  const res = await api.get("/product/all-products");
  return res.data.data;
};

export const fetchSingleProduct = async (productId) => {
  try {
    // This call now retrieves { success, product, relatedProducts } from the backend
    const { data } = await api.get(`/product/${productId}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Added optional chaining (?.) to prevent crash if server is offline (no response)
    return error.response?.data || { success: false, message: "Network error" };
  }
};

export const fetchProductsByCategory = async () => {
  const res = await api.get("/product/category");
  return res.data.data || { fruits: [], vegetables: [], dairy: [] };
};

// ? =========================    ORDER APIs   =================================

export const placeOrder = async ({
  shippingAddress,
  paymentMethod,
  deliveryCharge,
}) => {
  const res = await api.post("/order/place-order", {
    shippingAddress,
    paymentMethod,
    deliveryCharge,
  });
  return res.data;
};

export const fetchUserOrders = async () => {
  try {
    const res = await api.get("/order/user-orders");
    return res.data;
  } catch (error) {
    let res = {};
    res.success = false;
    res.message = error.response.data.message;
    return res;
  }
};

// ? =======================    FARMER APIs (Dashboard & Management)  =========================

export const addProductByFarmer = async (formData) => {
  try {
    const { data } = await api.post("/product/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    // Fixed: return was preventing log, swapped order if log is needed,
    // or just returning error as per your logic.
    console.log("Error:", error.response?.data);
    return error;
  }
};

export const fetchFarmerProducts = async () => {
  try {
    const { data } = await api.get("/product/my-products");
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log("Error:", error.response.data);
    return error.response.data;
  }
};

export const fetchFarmerOrders = async () => {
  try {
    const res = await api.get("/order/farmer-orders");
    if (res.data.success) {
      return res.data.orders;
    }
  } catch (error) {
    let res = {};
    res.success = false;
    res.message = error.response.data.message;
    return res;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/order/${orderId}/status`, { status });
  return res.data;
};

export const fetchAnalytics = async () => {
  const { data } = await api.get("/analytics/farmer");
  console.log(data);
  return data;
};

export const deleteProductByFarmer = async (productId) => {
  const response = await api.delete(`/product/${productId}`);
  return response.data;
};

// ? ==========================  FARMER APIs (Profile & Public View)  ================================

export const fetchFarmerProfile = async () => {
  const { data } = await api.get("/auth/farmer-profile");
  return data.data;
};

export const fetchTopFarmers = async () => {
  const { data } = await api.get("/order/top-farmers");
  return data.data;
};

export const fetchFarmerProfileForUser = (farmerId) => {
  console.log(farmerId);
  return api.get(`/auth/farmer-profile-user/${farmerId}`);
};

// ? =========================== BLOG APIs  ===============================

export const getMyBlogs = async () => {
  try {
    const response = await api.get("/blogs/myblogs");
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const createBlog = async (data) => {
  try {
    const response = await api.post("/blogs", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const fetchBlogs = async () => {
  const { data } = await api.get("/blogs");
  return data.data;
};

export const likeBlogAPI = async (blogId) => {
  const { data } = await api.post(`/blogs/${blogId}/like`, {});
  return data;
};

export const fetchBlog = async (id) => {
  const { data } = await api.get(`/blogs/${id}`);
  return data.data;
};

export default api;
