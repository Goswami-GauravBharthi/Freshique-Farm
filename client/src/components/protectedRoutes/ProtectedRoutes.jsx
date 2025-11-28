// src/components/protectedRoutes/ProtectedRoutes.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600">
            
        </div>
      </div>
    );
  }
  // If NOT logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → render protected pages
  return <Outlet />;
};

export default ProtectedRoute;
