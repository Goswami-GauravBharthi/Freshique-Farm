import React from "react";
import {
  LayoutDashboard,
  Users,
  Wheat,
  FileText,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { api } from "../api/api";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Farmers", path: "/farmers" }, // Placeholders for future pages
    { icon: ShoppingBag, label: "Products", path: "/products" },
    { icon: FileText, label: "Blogs", path: "/blogs" },
  ];
const handleLogout = async () => {
  try {
    await api.post("/api/admin/logout");
    // Force reload to clear state and trigger App.jsx logic again
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed", error);
  }
};
  return (
    <div className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <Wheat className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold text-gray-800">
          Freshuique<span className="text-primary">Admin</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-50 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
