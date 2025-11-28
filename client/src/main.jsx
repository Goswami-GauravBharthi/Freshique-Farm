// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store/store.js";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import About from "./pages/About.jsx";
// import Market from "./pages/Market.jsx";
// import Home from "./pages/Home.jsx";

// //?=================================Auth Routes=================================?
// import { Login } from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";

// import Cart from "./components/UI/Cart.jsx";
// import Profile from "./pages/Profile.jsx";
// import ProtectedRoute from "./components/protectedRoutes/ProtectedRoutes.jsx";
// import ProtectedLogin from "./components/protectedRoutes/ProtectedLogin.jsx";

// import Dashboard from "./pages/Farmer/Dashboard.jsx";
// import FarmerProfile from "./pages/Farmer/Profile.jsx";
// import Analytics from "./pages/Farmer/Analytics.jsx";
// import AddProduct from "./pages/Farmer/Products.jsx";
// import WatchProducts from "./pages/Farmer/WatchProducts.jsx";
// import Community from "./pages/Farmer/Community.jsx";
// import ProtectedFarmerDashboard from "./components/protectedRoutes/ProtectedFarmerDashBoard.jsx";
// import ProtectedSignUp from "./components/protectedRoutes/ProtectedSignUp.jsx";
// import SingleProduct from "./pages/SingleProduct.jsx";
// import MyOrder from "./pages/MyOrder.jsx";
// import Orders from "./pages/Farmer/Order.jsx";
// import CommunityForUser from "./pages/Community.jsx";
// import BlogDetailPage from "./pages/BlogDetailPage.jsx";
// import FarmerPage from "./components/UI/FarmerPage.jsx";
// import ProtectedPlaceOrder from "./components/protectedRoutes/ProtectedPlaceOrder.jsx";
// import PlaceOrderPage from "./pages/PlaceOrder.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />, // Home layout with Outlet + Footer
//     children: [
//       { path: "/", element: <Home /> }, // Default child route
//       { path: "about", element: <About /> },
//       { path: "community", element: <CommunityForUser /> },
//       { path: "community/blog/:id", element: <BlogDetailPage /> },
//       { path: "market", element: <Market /> },
//       { path: "cart", element: <Cart /> },
//       { path: "product/:id", element: <SingleProduct /> },
//       { path: "farmerPage/:id", element: <FarmerPage /> },
//       {
//         path: "profile",
//         element: <ProtectedRoute />,
//         children: [
//           {
//             path: "",
//             element: <Profile />,
//           },
//         ],
//       },
//       {
//         path: "place-order",
//         element: <ProtectedPlaceOrder />,
//         children: [
//           {
//             path: "",
//             element: <PlaceOrderPage />,
//           },
//         ],
//       },
//       {
//         path: "my-orders",
//         element: <MyOrder />,
//       },
//       {
//         path: "login",
//         element: <ProtectedLogin />,
//         children: [
//           {
//             path: "",
//             element: <Login />,
//           },
//         ],
//       },
//       {
//         path: "signup",
//         element: <ProtectedSignUp />,
//         children: [
//           {
//             path: "",
//             element: <Register />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: "farmer/dashboard",
//     element: <ProtectedFarmerDashboard />,
//     children: [
//       {
//         path: "",
//         element: <Dashboard />,
//         children: [
//           { path: "", element: <FarmerProfile /> },
//           {
//             path: "analytics",
//             element: <Analytics />,
//           },
//           {
//             path: "add-product",
//             element: <AddProduct />,
//           },
//           {
//             path: "products",
//             element: <WatchProducts />,
//           },
//           {
//             path: "community",
//             element: <Community />,
//           },
//           {
//             path: "orders",
//             element: <Orders />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </Provider>
// );

//?=============================================================================================

// main.jsx or index.js
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Market from "./pages/Market.jsx";
import Cart from "./components/UI/Cart.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import FarmerPage from "./components/UI/FarmerPage.jsx";
import CommunityForUser from "./pages/Community.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

// Auth Pages
import { Login } from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Protected Pages
import Profile from "./pages/Profile.jsx";
import MyOrder from "./pages/MyOrder.jsx";
import PlaceOrderPage from "./pages/PlaceOrder.jsx";

// Farmer Dashboard
import Dashboard from "./pages/Farmer/Dashboard.jsx";
import FarmerProfile from "./pages/Farmer/Profile.jsx";
import Analytics from "./pages/Farmer/Analytics.jsx";
import AddProduct from "./pages/Farmer/Products.jsx";
import WatchProducts from "./pages/Farmer/WatchProducts.jsx";
import Community from "./pages/Farmer/Community.jsx";
import Orders from "./pages/Farmer/Order.jsx";

// Protected Route Components
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoutes.jsx";
import ProtectedLogin from "./components/protectedRoutes/ProtectedLogin.jsx";
import ProtectedSignUp from "./components/protectedRoutes/ProtectedSignUp.jsx";
import ProtectedFarmerDashboard from "./components/protectedRoutes/ProtectedFarmerDashBoard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "market", element: <Market /> },
      { path: "cart", element: <Cart /> },
      { path: "product/:id", element: <SingleProduct /> },
      { path: "farmerPage/:id", element: <FarmerPage /> },
      { path: "community", element: <CommunityForUser /> },
      { path: "community/blog/:id", element: <BlogDetailPage /> },

      // PROTECTED USER ROUTES – only logged-in users
      {
        element: <ProtectedRoute />, // ← Wrapper that checks auth
        children: [
          { path: "profile", element: <Profile /> },
          { path: "my-orders", element: <MyOrder /> },
          { path: "place-order", element: <PlaceOrderPage /> },
        ],
      },

      // Public but redirect if logged in
      {
        element: <ProtectedLogin />,
        children: [{ path: "login", element: <Login /> }],
      },
      {
        element: <ProtectedSignUp />,
        children: [{ path: "signup", element: <Register /> }],
      },
    ],
  },

  //farmer protected routes
  {
    path: "/farmer/dashboard",
    element: <ProtectedFarmerDashboard />,
    children: [
      {
        // Remove the extra path: ""
        element: <Dashboard />,
        children: [
          // This is the index route — only runs when no subpath
          { index: true, element: <Navigate to="profile" replace /> },

          { path: "profile", element: <FarmerProfile /> },
          { path: "analytics", element: <Analytics /> },
          { path: "add-product", element: <AddProduct /> },
          { path: "products", element: <WatchProducts /> },
          { path: "community", element: <Community /> },
          { path: "orders", element: <Orders /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>
);
