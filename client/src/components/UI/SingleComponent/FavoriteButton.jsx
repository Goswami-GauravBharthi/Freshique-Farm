// src/components/FavoriteButton.jsx
import React from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { isFavorite, toggleFavorite } from "../../../utils/favorites";

const FavoriteButton = ({ product, size = "md", className = "" }) => {
  const [liked, setLiked] = React.useState(isFavorite(product._id));

  React.useEffect(() => {
    setLiked(isFavorite(product._id));
  }, [product._id]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { added } = toggleFavorite(product);
    setLiked(added);

    toast.success(added ? "Added to ❤️ Favorites" : "Removed from favorites");
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all ${className}`}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all ${
          liked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-600 hover:text-red-500"
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
