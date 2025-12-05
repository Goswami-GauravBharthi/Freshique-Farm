// pages/farmer/FarmerOrdersPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  MapPin,
  User,
  IndianRupee,
} from "lucide-react";
import { fetchFarmerOrders, updateOrderStatus } from "../../apis/api";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending",
  },
  confirmed: {
    color: "bg-blue-100 text-blue-800",
    icon: Package,
    label: "Confirmed",
  },
  preparing: {
    color: "bg-purple-100 text-purple-800",
    icon: Package,
    label: "Preparing",
  },
  out_for_delivery: {
    color: "bg-orange-100 text-orange-800",
    icon: Truck,
    label: "Out for Delivery",
  },
  delivered: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Delivered",
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Cancelled",
  },
};

const statusOptions = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function FarmerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["farmerOrders"],
    queryFn: fetchFarmerOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["farmerOrders"]);
      queryClient.invalidateQueries(["userOrders"]);
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: updateStatusMutation.variables.status } : null
      );
    },
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.phone.includes(searchTerm)
  );

  // Native JS formatting (NO date-fns)
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${month} ${year}, ${time}`;
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] rounded-lg bg-linear-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800">My Orders</h1>
          <p className="text-xl text-gray-600 mt-2">
            Manage and track all customer orders
          </p>
        </motion.div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, Phone..."
              className="w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-center">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-20 text-gray-500 text-xl"
                    >
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const StatusIcon =
                      statusConfig[order.status]?.icon || Clock;
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-5 font-semibold text-green-600">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {order.items.length}
                        </td>
                        <td className="px-6 py-5 text-center font-bold text-green-600">
                          ₹{(order.totalAmount + order.deliveryCharge).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                              statusConfig[order.status]?.color
                            }`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[order.status]?.label}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center text-sm">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            View Details →
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusChange={(newStatus) =>
                updateStatusMutation.mutate({
                  orderId: selectedOrder.orderId,
                  status: newStatus,
                })
              }
              isUpdating={updateStatusMutation.isLoading}
              formatFullDate={formatFullDate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// Modal Component (No date-fns)
// Inside the same file - replace your empty OrderDetailModal
function OrderDetailModal({ order, onClose, onStatusChange, isUpdating, formatFullDate }) {
  const [newStatus, setNewStatus] = useState(order.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Order {order.orderId}</h2>
              <p className="text-gray-600 mt-1">Placed on {formatFullDate(order.createdAt)}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
              <XCircle className="w-8 h-8" />
            </button>
          </div>

          {/* Customer Info + Status Update */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Customer */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-green-600" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <p className="font-semibold text-lg">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5" /> {order.shippingAddress.phone}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  {order.shippingAddress.address && `${order.shippingAddress.address}, `}
                  {order.shippingAddress.area}, {order.shippingAddress.city} - {order.shippingAddress.pin_code}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Update Order Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-5 py-4 border-2 border-green-300 rounded-xl text-lg font-medium focus:outline-none focus:border-green-600 transition"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onStatusChange(newStatus)}
                disabled={isUpdating || newStatus === order.status}
                className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-lg"
              >
                {isUpdating ? "Updating Status..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-50 rounded-xl p-5 flex justify-between items-center hover:shadow-md transition"
                >
                  <div className="flex items-center gap-5">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-gray-600">
                        {item.quantity} {item.unit} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 text-center">
            <p className="text-sm opacity-90">Total Earnings from this Order</p>
            <p className="text-4xl font-bold mt-2 flex items-center justify-center gap-3">
              <IndianRupee className="w-10 h-10" />
              ₹{(order.totalAmount + order.deliveryCharge).toFixed(2)}
            </p>
            {order.paymentMethod === "cod" && (
              <p className="mt-3 text-lg opacity-90">Cash on Delivery</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
