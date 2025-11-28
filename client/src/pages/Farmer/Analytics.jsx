// src/pages/FarmerAnalyticsDashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  IndianRupee,
  Activity,
  Calendar,
  Clock,
  Award,
  CreditCard,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchAnalytics } from "../../apis/api";

const formatCurrency = (value) => {
  const num = Number(value ?? 0);
  if (num === 0) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(Number(num ?? 0));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const formatFullDate = (iso) => {
  if (!iso) return "Just now";
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function FarmerAnalyticsDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["farmerAnalytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen rounded-2xl bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-green-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-green-800">
            Loading Your Farm Report...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
          <p className="text-red-600 text-2xl font-bold mb-2">
            Connection Issue
          </p>
          <p className="text-gray-600">Please check internet and refresh</p>
        </div>
      </div>
    );
  }

  // Safe access with optional chaining
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topProducts = data?.topProducts ?? [];
  const paymentBreakdown = data?.paymentBreakdown ?? [];
  const activeOrderStatus = data?.activeOrderStatus ?? {};
  const generatedAt = data?.generatedAt;

  const dailySalesData = charts?.dailySales30Days ?? [];
  const monthlyTrend = charts?.monthlyRevenueTrend ?? [];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  const totalActive = Object.values(activeOrderStatus).reduce(
    (a, b) => a + Number(b || 0),
    0
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-slate-200 rounded-2xl py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={item} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
            <span>My Farm Dashboard</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mt-3 font-medium">
            See how your hard work is paying off!
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
          {[
            {
              label: "Today's Earnings",
              value: summary.todayRevenue,
              icon: IndianRupee,
              color: "emerald",
              isMoney: true,
            },
            {
              label: "Today's Orders",
              value: summary.todayOrders,
              icon: ShoppingCart,
              color: "blue",
            },
            {
              label: "Avg Order Value",
              value: summary.todayAOV,
              icon: IndianRupee,
              color: "purple",
              isMoney: true,
            },
            {
              label: "This Month",
              value: summary.monthlyRevenue,
              icon: TrendingUp,
              color: "green",
              isMoney: true,
            },
            {
              label: "Growth (Month)",
              value: Number(summary.monthlyGrowth || 0).toFixed(1),
              icon:
                Number(summary.monthlyGrowth || 0) > 0
                  ? TrendingUp
                  : TrendingDown,
              color: Number(summary.monthlyGrowth || 0) > 0 ? "green" : "red",
              suffix: "%",
            },
            {
              label: "90 Days Total",
              value: summary.last90DaysRevenue,
              icon: Calendar,
              color: "teal",
              isMoney: true,
            },
            {
              label: "All Time Earnings",
              value: summary.totalRevenue,
              icon: Award,
              color: "yellow",
              isMoney: true,
            },
            {
              label: "Total Orders",
              value: summary.totalOrders,
              icon: Package,
              color: "indigo",
            },
            {
              label: "Happy Customers",
              value: summary.uniqueCustomers,
              icon: Users,
              color: "pink",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                    {card.label}
                  </p>
                  <div className={`p-2.5 rounded-full bg-${card.color}-100`}>
                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                  </div>
                </div>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    card.isMoney ? "text-green-700" : "text-gray-900"
                  }`}
                >
                  {card.isMoney
                    ? formatCurrency(card.value)
                    : formatNumber(card.value)}
                  {card.suffix && (
                    <span className="text-lg ml-1">{card.suffix}</span>
                  )}
                </p>
              </div>
              {card.label === "Growth" && (
                <div
                  className={`h-2 ${
                    Number(card.value) > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            variants={item}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Activity className="w-8 h-8 text-emerald-600" />
              Last 30 Days Performance
            </h3>
            {dailySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    name="Earnings"
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No sales data yet
              </div>
            )}
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              Monthly Trend
            </h3>
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No monthly data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Products - 100% Mobile-Perfect, No Overlap */}
        <motion.div
          variants={item}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10"
        >
          <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 py-5">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8" />
              My Best Selling Items
            </h3>
            <p className="text-green-100 text-sm mt-1">
              Last 90 days performance
            </p>
          </div>

          {topProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {topProducts.slice(0, 10).map((p, i) => (
                <motion.div
                  key={p.productId || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 sm:p-5 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base shadow-lg shrink-0 ${
                        i === 0
                          ? "bg-linear-to-br from-yellow-400 to-orange-500"
                          : i === 1
                          ? "bg-linear-to-br from-gray-400 to-gray-600"
                          : i === 2
                          ? "bg-linear-to-br from-orange-400 to-red-500"
                          : "bg-linear-to-br from-green-500 to-emerald-600"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Product Image */}
                    <div className="shrink-0">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/60/10b981/ffffff?text=IMG";
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center ring-2 ring-white shadow-md">
                          <Package className="w-7 h-7 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info - Column on mobile */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight truncate">
                          {p.name || "Unknown Product"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm">
                          <span className="text-gray-600">
                            {formatNumber(p.totalQty || 0)} {p.unit || "units"}
                          </span>
                          {i < 3 && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                i === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : i === 1
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {i === 0 ? "Top" : i === 1 ? "2nd" : "3rd"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price - Always on right, no overlap */}
                      <div className="text-right shrink-0">
                        <p className="text-xl sm:text-2xl font-bold text-green-700 leading-tight">
                          {formatCurrency(p.totalSales)}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Earnings
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6">
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-inner">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-700 mb-2">
                No Sales Yet
              </h4>
              <p className="text-gray-500 text-lg">
                Your first customer is coming soon!
              </p>
              <p className="text-green-600 font-medium mt-4 text-xl">
                Keep going!
              </p>
            </div>
          )}
        </motion.div>

        {/* Payment + Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={item}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
              Payment Methods
            </h3>
            {paymentBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      dataKey="count"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >
                      {paymentBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v} orders`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-3">
                  {paymentBreakdown.map((p, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i] }}
                        ></div>
                        {p.method || "Unknown"}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No payment data
              </div>
            )}
          </motion.div>

          <motion.div
            variants={item}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                Orders in Progress
              </h3>
              {totalActive > 0 && (
                <div className="text-4xl font-bold text-orange-600">
                  {totalActive}
                </div>
              )}
            </div>

            {totalActive === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">All Done!</div>
                <p className="text-2xl text-gray-600">
                  No pending orders right now
                </p>
                <p className="text-gray-500 mt-3 text-lg">
                  Great job! Everything delivered
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(activeOrderStatus).map(([status, count]) => {
                  const labels = {
                    pending: "Waiting",
                    confirmed: "Confirmed",
                    preparing: "Packing",
                    out_for_delivery: "On Way",
                  };
                  return (
                    <div
                      key={status}
                      className="text-center p-5 bg-orange-50 rounded-2xl border-2 border-orange-200"
                    >
                      <p className="text-3xl sm:text-4xl font-bold text-orange-600">
                        {count || 0}
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-2">
                        {labels[status] || status.replace(/_/g, " ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-12 text-center text-gray-600">
          <p className="text-sm sm:text-base">
            Last updated:{" "}
            <span className="font-semibold">{formatFullDate(generatedAt)}</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
