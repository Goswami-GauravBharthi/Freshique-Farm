import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./api/api";

// Components
import DashboardHome from "./pages/DashboardHome";
import Farmers from "./pages/Farmer";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check Auth Status on Mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get("/api/admin/check-auth");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: Login Page */}
        <Route
          path="/login"
          element={
            !isLoading && isAuthenticated ? (
              <Navigate to="/" replace /> // If already logged in, go to Dashboard
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Route 2: Protected Routes (Wrapped in Layout) */}
        <Route
          element={
            <ProtectedLayout
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
          }
        >
          <Route path="/" element={<DashboardHome />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blogs" element={<Blogs />} />
        </Route>

        {/* Catch all - Redirect to login or home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
