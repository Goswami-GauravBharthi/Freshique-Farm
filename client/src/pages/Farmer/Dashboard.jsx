import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Leaf,
  Package,
  Plus,
  BarChart2,
  Users,
  Truck,
  User,
  LogOut,
  LeafIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../apis/api";
import { setLogout } from "../../store/authSlice";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../../utils/ScrollBug";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      dispatch(setLogout());
      navigate("/", { replace: true });
    }
  };

  const navItems = [
    { to: "/farmer/dashboard", label: "Profile", icon: User, exact: true },
    { to: "/farmer/dashboard/products", label: "My Products", icon: Package },
    { to: "/farmer/dashboard/add-product", label: "Add Product", icon: Plus },
    { to: "/farmer/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { to: "/farmer/dashboard/community", label: "Community", icon: Users },
    { to: "/farmer/dashboard/orders", label: "Orders", icon: Truck },
    { to: "/farmer/dashboard/ai-tool", label: "AI Plant Analyzer", icon: LeafIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster position="top-center" />
      <ScrollToTop />

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-60 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#004030] text-white z-50 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-400" />
            <span className="text-xl font-bold">Freshique</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-green-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Sidebar - Slim, Professional, Fixed */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-[#004030] text-white z-50 transform transition-transform duration-300 
          ${sidebarOpen && isMobile ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 shadow-2xl flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-green-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
              <Leaf className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Freshique</h1>
              <p className="text-xs text-green-300">Farmer Portal</p>
            </div>
          </div>
        </div>

        {/* Farmer Profile - Horizontal Layout */}
        <div className="px-6 py-5 border-b border-green-900 flex items-center gap-4">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <img
              src={user?.profilePicture || "https://via.placeholder.com/80"}
              alt={user?.fullName}
              className="w-16 h-16 rounded-full object-cover border-3 border-green-400 shadow-md"
            />
            {/* Online/Active Indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-[#004030] rounded-full"></div>
          </div>

          {/* Name + Email */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {user?.fullName || "Farmer"}
            </h2>
            <p className="text-sm text-green-300 truncate">
              {user?.email || "farmer@freshique.com"}
            </p>
            <span className="text-xs text-green-400 font-medium">
              Active Producer
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-green-100 hover:bg-green-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {({ isActive }) =>
                isActive && (
                  <div className="ml-auto w-1 h-8 bg-white rounded-full" />
                )
              }
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - Always Visible */}
        <div className="p-4 border-t border-green-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-red-600/50"
          >
            <LogOut size={18} />
            Logout
          </button>
          <p className="text-center text-xs text-green-400 mt-3">
            © 2025 Freshique Farm
          </p>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 bg-[#004030]  sm:p-4 md:p-8 mt-16 md:mt-0 md:ml-64 overflow-y-auto">
        {/* Dynamic Page Content */}
        <section className="animate-fadeIn  min-h-[calc(100vh-8rem)]">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
