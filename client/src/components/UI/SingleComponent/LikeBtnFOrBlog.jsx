// components/LikeButton.jsx
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const LikeButton = ({ isLiked, likesCount, onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all
                 bg-gray-100 hover:bg-gray-200 disabled:opacity-70"
    >
      <motion.div
        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={22}
          className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
        />
      </motion.div>
      <span className={isLiked ? "text-red-600" : "text-gray-700"}>
        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
};

export default LikeButton;
