import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Truck,
  CreditCard,
  Wallet,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../apis/api";
import { fetchCart } from "../store/cartSlice";

// Your delivery areas
const deliveryAreas = [
  "Waghawadi Road",
  "Nilambaug Circle",
  "Nari Road",
  "Krishna Nagar",
  "Kaliyabid",
  "RTO Circle",
  "Panwadi",
  "Ghogha Circle",
  "Sardarnagar",
  "Nana Mava Road",
];

const ProductItem = React.memo(({ item }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 object-cover rounded-lg"
    />
    <div className="flex-1">
      <h4 className="font-semibold text-gray-800">{item.name}</h4>
      <p className="text-sm text-gray-500">₹{item.price}/kg</p>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold">
        ₹{(item.price * item.quantity).toFixed(2)}
      </p>
      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
    </div>
  </div>
));

const AddressItem = React.memo(
  ({
    addr,
    index,
    selectedAddressId,
    setSelectedAddressId,
    handleDeleteAddress,
  }) => (
    <label
      key={index}
      className={`block p-5 rounded-xl border-2 cursor-pointer transition-all ${
        selectedAddressId === index
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <input
            type="radio"
            name="address"
            checked={selectedAddressId === index}
            onChange={() => setSelectedAddressId(index)}
            className="hidden"
          />
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">Home</p>
            </div>
            <p className="font-medium">
              {addr.fullName} • {addr.phone}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {addr.address ? `${addr.address}, ` : ""}
              {addr.area}, {addr.city} - {addr.pin_code}
            </p>
          </div>
        </div>

        {!addr.isDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(index);
            }}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </label>
  )
);

const PaymentOption = React.memo(
  ({
    type,
    label,
    subLabel,
    icon: Icon,
    checked,
    onChange,
    disabled = false,
    comingSoon = false,
  }) => (
    <label
      className={`flex items-center p-4 border rounded-xl cursor-pointer ${
        disabled
          ? "cursor-not-allowed opacity-70 hover:bg-gray-50"
          : "hover:bg-gray-50"
      }`}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-5 h-5 ${disabled ? "text-gray-400" : "text-green-600"}`}
      />
      <span className="ml-4 flex-1">
        <p className={`font-medium ${disabled ? "text-gray-500" : ""}`}>
          {label}
        </p>
        {comingSoon ? (
          <p className="text-xs text-orange-600">Feature available soon</p>
        ) : (
          <p className="text-sm text-gray-500">{subLabel}</p>
        )}
      </span>
      <Icon
        className={`w-6 h-6 ${disabled ? "text-gray-400" : "text-gray-600"}`}
      />
    </label>
  )
);

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  let deliveryCharge;
  if (subtotal > 300) {
    deliveryCharge = 0;
  } else {
    deliveryCharge = 30;
  }
  const total = subtotal + deliveryCharge;

  // Load addresses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tempAddresses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses([...parsed]);
      } catch (e) {
        setAddresses([]);
      }
    }
  }, []);

  // Save to localStorage whenever temp addresses change
  const saveToLocalStorage = useCallback((addrList) => {
    localStorage.setItem("tempAddresses", JSON.stringify(addrList));
  }, []);

  const handleDeleteAddress = useCallback(
    (index) => {
      const updated = addresses.filter((_, i) => i !== index);
      setAddresses(updated);
      saveToLocalStorage(updated);
      if (selectedAddressId === index) {
        setSelectedAddressId(null); // or default one later
      }
    },
    [addresses, selectedAddressId, saveToLocalStorage]
  );

  const handleAddTempAddress = useCallback(
    (newAddr) => {
      const newAddress = {
        ...newAddr,
        id: Date.now(), // Ensure unique id
      };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      saveToLocalStorage(updated);
      setSelectedAddressId(updated.length - 1);
      setIsAddingAddress(false);
    },
    [addresses, saveToLocalStorage]
  );

  const handlePlaceOrder = useCallback(async () => {
    if (addresses.length === 0) {
      alert("Please add a delivery address");
      return;
    }
    const shippingAddress = addresses[selectedAddressId];

    const res = await placeOrder({
      shippingAddress,
      paymentMethod,
      deliveryCharge,
    });

    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/my-orders");
        dispatch(fetchCart());
      }, 4000);
    }
  }, [
    addresses,
    selectedAddressId,
    paymentMethod,
    deliveryCharge,
    navigate,
    dispatch,
  ]);

  const handleUPIChange = useCallback(() => {
    alert("UPI Payment is coming soon!");
  }, []);

  const handleAddAddressClick = useCallback(() => {
    setIsAddingAddress(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddingAddress(false);
  }, []);

  return (
    <>
      <div className="bg-linear-to-br from-green-50 to-emerald-50 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-800 mb-10"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* === LEFT: Products & Address === */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Product List - 100% UNCHANGED */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Truck className="w-7 h-7 text-green-600 mr-3" />
                  Your Fresh Items
                </h2>
                <div className="space-y-4">
                  {cartItems?.map((item) => (
                    <ProductItem key={item._id} item={item} />
                  ))}
                </div>
              </motion.div>

              {/* 2. Delivery Address - ONLY THIS PART CHANGED */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <MapPin className="w-7 h-7 text-green-600 mr-3" />
                    Delivery Address
                  </h2>
                  <button
                    onClick={handleAddAddressClick}
                    className="text-green-600 font-medium flex items-center hover:bg-green-50 px-4 py-2 rounded-lg transition"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr, index) => (
                    <AddressItem
                      key={index}
                      addr={addr}
                      index={index}
                      selectedAddressId={selectedAddressId}
                      setSelectedAddressId={setSelectedAddressId}
                      handleDeleteAddress={handleDeleteAddress}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* === RIGHT: Order Summary & Payment - 100% UNCHANGED === */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100 sticky top-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-lg mb-3">Payment Method</h3>
                  <PaymentOption
                    type="cod"
                    label="Cash on Delivery"
                    subLabel="Pay when you receive"
                    icon={Wallet}
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <PaymentOption
                    type="upi"
                    label="UPI / Card / Netbanking"
                    icon={CreditCard}
                    checked={paymentMethod === "upi"}
                    onChange={handleUPIChange}
                    disabled={true}
                    comingSoon={true}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlaceOrder}
                  className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg transition transform active:scale-95"
                >
                  Place Order (COD)
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Success Popup - unchanged */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-linear-to-b from-black/60 via-gray-900/50 to-black/60 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl"
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Order Placed Successfully!
                </h2>
                <p className="text-xl text-gray-700 mb-2">
                  Your fresh harvest is on the way
                </p>
                <p className="text-lg font-medium text-green-600">
                  Expected Delivery: Around 5:00 PM Today
                </p>
                <p className="text-sm text-gray-500 mt-6">
                  Redirecting to home...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ONLY THIS MODAL IS UPDATED */}
        <AnimatePresence>
          {isAddingAddress && (
            <AddAddressModal
              onClose={handleModalClose}
              onSave={handleAddTempAddress}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// UPDATED MODAL ONLY - Matches your exact schema
const AddAddressModal = React.memo(({ onClose, onSave }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "", // House no, flat, landmark (optional)
    area: "", // Selected area
    city: "Bhavnagar",
    pin_code: "",
  });

  const handleChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!form.fullName || !form.phone || !form.area) {
        alert("Please fill Full Name, Phone and select Area");
        return;
      }

      onSave({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        area: form.area,
        city: form.city,
        pin_code: form.pin_code,
      });
    },
    [form, onSave]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-linear-to-b from-black/50 via-gray-900/30 to-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6">Add Delivery Address</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border rounded-xl"
            value={form.fullName}
            onChange={handleChange("fullName")}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-4 border rounded-xl"
            value={form.phone}
            onChange={handleChange("phone")}
            required
          />

          {/* Area Dropdown */}
          <select
            className="w-full p-4 border rounded-xl text-gray-700"
            value={form.area}
            onChange={handleChange("area")}
            required
          >
            <option value="">Select Delivery Area</option>
            {deliveryAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Optional House Details */}
          <input
            type="text"
            placeholder="House / Flat No, Building Name, Landmark (Optional)"
            className="w-full p-4 border rounded-xl"
            value={form.address}
            onChange={handleChange("address")}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value="Bhavnagar"
              className="p-4 border rounded-xl bg-gray-50"
              readOnly
            />
            <input
              type="text"
              placeholder="Pincode"
              value={form.pin_code}
              onChange={handleChange("pin_code")}
              className="p-4 border rounded-xl bg-gray-50"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold"
            >
              Save Address
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
});
