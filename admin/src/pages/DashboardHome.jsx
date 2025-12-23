import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import {
  Users,
  Tractor,
  ShoppingBasket,
  BookOpen,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  // Fetch Stats using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // Ensure this endpoint matches your backend route
      const response = await api.get("/api/admin/stats");
      return response.data;
    },
    // Keep data fresh but don't over-fetch
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const stats = data?.stats;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-red-500">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p className="text-lg font-medium">Failed to load dashboard data.</p>
        <p className="text-sm text-gray-500">Check your server connection.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">
          Welcome back, Admin. Here's what's happening at Freshiquefarm.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Farmers"
          value={stats?.totalFarmers || 0}
          icon={Tractor}
          color="bg-green-600"
          loading={isLoading}
        />
        <StatCard
          title="Active Consumers"
          value={stats?.totalConsumers || 0}
          icon={Users}
          color="bg-blue-500"
          loading={isLoading}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={ShoppingBasket}
          color="bg-orange-500"
          loading={isLoading}
        />
        <StatCard
          title="Total Blogs"
          value={stats?.totalBlogs || 0}
          icon={BookOpen}
          color="bg-purple-500"
          loading={isLoading}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
         
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : data?.recentOrders?.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      {order.consumer?.fullName || "Guest"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
