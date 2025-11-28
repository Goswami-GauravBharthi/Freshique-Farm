import React from 'react'
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../store/cartSlice';

function SingleCartProduct({item,index}) {

    const dispatch=useDispatch();

    const removeItem = (id) => {
      dispatch(removeFromCart(id));
    };

    const increase = () => {
      dispatch(
        updateQuantity({
          productId: item.productId,
          quantity: Number(item.quantity + 1),
        })
      );
    };

    const decrease = () => {
      dispatch(
        updateQuantity({
          productId: item.productId,
          quantity: Number(item.quantity - 1),
        })
      );
    };
  return (
    <motion.div
      key={item.productId}
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl  p-3 mb-5 overflow-hidden border border-green-500"
    >
      <div className="flex gap-6">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-sm md:text-xl  font-semibold text-gray-800">
            {item.name}
          </h3>
          <p className="text-md md:text-xl font-bold text-green-600 mt-1">
            ₹{item?.price?.toFixed(2)}{" "}
            <span className="text-sm">Per {item.unit}</span>
          </p>

          <div className="flex items-center gap-3 mt-4 ">
            <button
              onClick={decrease}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4 " />
            </button>
            <span className="w-12 text-center font-semibold text-lg">
              {item.quantity} <span className="text-sm">{item.unit}</span>
            </span>

            <button
              onClick={increase}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all  cursor-pointer"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-md md:text-lg font-bold text-gray-800">
            ₹{(item?.price * item?.quantity)?.toFixed(2)}
          </p>
          <button
            onClick={() => removeItem(item.productId)}
            className="mt-4 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default SingleCartProduct