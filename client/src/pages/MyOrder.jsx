import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  MapPin,
  Calendar,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders } from "../apis/api"; // Ensure this path is correct
import ProductLoading from "../components/UI/Loadings/ProductLoading"; // Ensure this path is correct

// --- NEW IMPORTS FOR PDF GENERATION ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Configuration ---
const statusConfig = {
  pending: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
    label: "Pending",
    step: 1,
  },
  confirmed: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Package,
    label: "Confirmed",
    step: 2,
  },
  preparing: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Package,
    label: "Preparing",
    step: 3,
  },
  out_for_delivery: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Truck,
    label: "Out for Delivery",
    step: 4,
  },
  delivered: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
    label: "Delivered",
    step: 5,
  },
  cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    label: "Cancelled",
    step: 0,
  },
};

// --- PDF Generation Logic ---
const generateInvoice = (order) => {
  const doc = new jsPDF();

  // 1. Header - Company Info
  doc.setFontSize(20);
  doc.text("INVOICE", 14, 22);

  doc.setFontSize(10);
  doc.text("Freshique Farm", 14, 30);
  doc.text("contact@freshfarm.com", 14, 35);

  // 2. Order Details
  doc.text(`Order ID: #${order.orderId.toUpperCase()}`, 130, 30); // Moved left slightly for safety
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
    130,
    35
  );
  doc.text(`Status: ${order.status.toUpperCase()}`, 130, 40);

  // 3. Billing Details
  doc.text("Bill To:", 14, 50);
  doc.setFont("helvetica", "bold");
  doc.text(order.shippingAddress.fullName, 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(order.shippingAddress.address, 14, 60);
  doc.text(
    `${order.shippingAddress.city}, ${order.shippingAddress.state || ""} - ${
      order.shippingAddress.pincode
    }`,
    14,
    65
  );
  doc.text(`Phone: ${order.shippingAddress.phone}`, 14, 70);

  // 4. Table of Items
  const tableColumn = ["#", "Item Name", "Quantity", "Unit Price", "Total"];
  const tableRows = [];

  order.items.forEach((item, index) => {
    const itemData = [
      index + 1,
      item.name,
      `${item.quantity} ${item.unit}`,
      `Rs. ${item.price}`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`,
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [22, 163, 74] },
  });

  // 5. Summary (FIXED ALIGNMENT)
  const finalY = doc.lastAutoTable.finalY + 10;

  // X coordinates for alignment
  const labelX = 140; // Where "Subtotal" starts
  const valueX = 195; // Where the price ends (Right Aligned) - Moved further right

  // Subtotal
  doc.text("Subtotal:", labelX, finalY);
  doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, valueX, finalY, {
    align: "right",
  });

  // Delivery Charge
  doc.text("Delivery Charge:", labelX, finalY + 7);
  doc.text(`Rs. ${order.deliveryCharge.toFixed(2)}`, valueX, finalY + 7, {
    align: "right",
  });

  // Grand Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", labelX, finalY + 15);
  doc.text(
    `Rs. ${(order.totalAmount + order.deliveryCharge).toFixed(2)}`,
    valueX,
    finalY + 15,
    { align: "right" }
  );

  // 6. Save PDF
  doc.save(`Invoice_${order.orderId}.pdf`);
};

// --- Sub-Components ---

// 1. Order Progress Tracker
const OrderTracker = React.memo(({ currentStatus }) => {
  if (currentStatus === "cancelled") return null;

  const steps = ["Confirmed", "Preparing", "On Way", "Delivered"];
  const currentStep = statusConfig[currentStatus]?.step || 1;
  const activeIndex = currentStep - 2;

  return (
    <div className="w-full py-6 px-2">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10" />
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 rounded-full -z-10 transition-all duration-500"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          return (
            <div key={step} className="flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white shadow-green-200 shadow-lg scale-110"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={14} />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors ${
                  isCompleted ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// 2. Single Order Card
const OrderCard = React.memo(({ order, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const statusStyles = statusConfig[order.status] || statusConfig.pending;

  const formatDate = useMemo(
    () =>
      new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [order.createdAt]
  );

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "shadow-xl border-green-200 ring-1 ring-green-100"
          : "shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* --- Card Header --- */}
      <div
        onClick={handleToggle}
        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${statusStyles.color} bg-opacity-20`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 text-lg">
                #{order.orderId.slice(-6).toUpperCase()}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles.color}`}
              >
                {statusStyles.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={12} /> {formatDate} • {order.items.length} Items
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total
            </p>
            <p className="text-lg font-bold text-green-700">
              ₹{(order.totalAmount + order.deliveryCharge).toFixed(2)}
            </p>
          </div>
          <button
            className={`p-2 rounded-full transition-transform duration-300 ${
              isOpen ? "rotate-180 bg-gray-100" : ""
            }`}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* --- Expanded Details --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50/30"
          >
            <div className="p-5 md:p-8 space-y-8">
              {/* Tracker */}
              {order.status !== "cancelled" && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Order Status
                  </h4>
                  <OrderTracker currentStatus={order.status} />
                </div>
              )}

              {/* Grid Layout for Info */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ShoppingBag size={16} /> Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 items-center"
                      >
                        <img
                          src={item.image || "/placeholder-veg.jpg"}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} {item.unit} x ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-700 text-sm">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="space-y-6">
                  {/* Delivery */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin size={16} /> Delivery Details
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm">
                      <p className="font-medium text-gray-800 mb-1">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-gray-500 leading-relaxed">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.area}
                        <br />
                        {order.shippingAddress.city} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                      <p className="mt-2 text-green-600 font-medium text-xs bg-green-50 inline-block px-2 py-1 rounded">
                        Mobile: {order.shippingAddress.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <IndianRupee size={16} /> Payment Info
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm flex justify-between items-center">
                      <span className="text-gray-500">Method</span>
                      <span className="font-medium uppercase">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between px-2 text-sm">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`font-bold ${
                          order.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {order?.status.toLowerCase() === "delivered" && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => generateInvoice(order)}
                    className="text-green-700 hover:text-green-800 text-sm font-semibold hover:underline flex items-center gap-2"
                  >
                    Download Invoice
                  </button>
                </div>
              )}

              {/* Footer Actions (Download Invoice Button) */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// --- Main Page Component ---
export default function MyOrdersPage() {
  const [filter, setFilter] = useState("all");
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
  });

  const orders = data?.orders || [];

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (filter === "all") return true;
        if (filter === "active")
          return [
            "pending",
            "confirmed",
            "preparing",
            "out_for_delivery",
          ].includes(order.status);
        if (filter === "completed")
          return ["delivered", "cancelled"].includes(order.status);
        return true;
      }),
    [orders, filter]
  );

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  if (isLoading) return <ProductLoading />;

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">
          Failed to load orders
        </h3>
        <p className="text-gray-500 mb-6">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Order History
            </h1>
            <p className="text-gray-500 mt-1">
              Check the status of recent orders
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
            {["all", "active", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-500">
              Looks like you haven't placed any orders in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
