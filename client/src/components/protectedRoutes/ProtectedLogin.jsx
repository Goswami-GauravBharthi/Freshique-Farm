import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLogin = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is not authenticated, redirect to /login
  if (user?.role ==="consumer") {
    return <Navigate to="/" replace />;
  }else if(user?.role==="farmer"){
    return <Navigate to={"/farmer/dashboard"} />
  }
  // If authenticated, render the nested routes or component
  return <Outlet />;
};

export default ProtectedLogin;
