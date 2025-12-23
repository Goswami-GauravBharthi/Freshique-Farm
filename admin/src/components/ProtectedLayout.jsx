import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const ProtectedLayout = ({ isAuthenticated, isLoading }) => {
  // 1. Still checking auth status? Show a loader.
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // 2. Not authenticated? Redirect to Login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Authenticated? Render the Dashboard Layout.
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
