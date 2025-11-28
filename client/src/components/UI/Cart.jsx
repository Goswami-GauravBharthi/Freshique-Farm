import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
} from "../../store/cartSlice";
import SingleCartProduct from "./SingleComponent/SingleCartProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import ProductLoading from "./Loadings/ProductLoading";

const Cart = () => {
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCart());
  }, []);

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

  if (cartItems?.length === 0 || !cartItems) {
    return (
      <div className="min-h-[85vh] bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="w-24 h-24 text-green-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500">
            Add fresh farm products to get started!
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return <ProductLoading />;
  }

  const handleCartToOrder = () => {
    navigate("/place-order");
  };
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-green-100 via-white to-emerald-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-800"
          >
            <div className="relative inline-block">
              <FontAwesomeIcon
                icon={faBasketShopping}
                className="w-7 h-7 md:w-9 md:h-9 text-orange-400 drop-shadow-2xl"
                beat
              />

              <span className=" text-green-600 animate-bounce delay-300 px-3">
                Your Fresh Cart
              </span>
            </div>
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems?.map((item, index) => (
                  <SingleCartProduct item={item} index={index} key={index} />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-8 h-fit"
            >
              <div className="bg-linear-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">₹{total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCartToOrder}
                  className="w-full bg-white text-green-600 font-bold py-4 rounded-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-sm mt-4 opacity-90">
                  Free delivery on orders above ₹300
                </p>
              </div>

              <div className="mt-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl p-6 text-center">
                <p className="text-yellow-800 font-medium">
                  🌱 Fresh from farm to your door in 24 hours!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
