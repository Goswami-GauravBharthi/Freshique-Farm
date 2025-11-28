import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedFarmerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "farmer") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedFarmerDashboard;
