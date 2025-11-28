import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";

import  { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "./apis/api";
import { setUser } from "./store/authSlice";
import ScrollToTop from "./utils/ScrollBug";
import { fetchCart } from "./store/cartSlice";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      if (data.success) {
        dispatch(setUser(data.user));
        if (data?.user?.role === "farmer") {
          navigate("farmer/dashboard");
        }
      } else {
        dispatch(setUser(null));
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (user === null) {
      fetchUser();

      dispatch(fetchCart());
    }
  }, []);

  return (
    <div className="bg-linear-to-br from-yellow-100 via-emerald-50 to-green-200 ">
      <Toaster
        containerStyle={{
          zIndex: 9999, // HIGHER THAN ANY MODAL (even z-50 = 50)
        }}
      />
      <ScrollToTop />
      <Navbar />

      <main>
        <Outlet /> {/* Nested routes render here */}
      </main>

      <Footer />
    </div>
  );
};

export default App;
