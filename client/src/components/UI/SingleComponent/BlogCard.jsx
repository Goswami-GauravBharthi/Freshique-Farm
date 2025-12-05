import { memo, useCallback, useMemo } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLikeBlog } from "../../../hooks/useLikeBlog";
import LikeButton from "./LikeBtnFOrBlog";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const BlogCard = memo(({ blog }) => {
  const navigate = useNavigate();
  const { mutate: likeBlog, isPending } = useLikeBlog();

  
  const userId = useSelector((state) => state.auth.user?._id);
  const isLiked = useMemo(
    () => blog.likes?.includes(userId),
    [blog.likes, userId]
  );

  // 3. OPTIMIZATION: Stable event handlers to prevent child re-renders
  const handleCardClick = useCallback(() => {
    navigate(`/community/blog/${blog._id}`);
  }, [navigate, blog._id]);

  const handleAuthorClick = useCallback(
    (e) => {
      e.stopPropagation();
      navigate(`/farmerPage/${blog.author._id}`);
    },
    [navigate, blog.author._id]
  );

  const handleLikeClick = useCallback(
    (e) => {
      e.stopPropagation();
      likeBlog(blog._id);
    },
    [likeBlog, blog._id]
  );

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group 
                 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl will-change-transform"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-56 bg-gray-100">
        <img
          src={blog.image}
          alt={blog.title}
          loading="lazy" // Native lazy loading
          decoding="async" // Unblocks main thread during decoding
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 transition-colors duration-300 group-hover:text-green-600">
          {blog.title}
        </h3>

        <p className="text-gray-600 mt-3 line-clamp-3 text-sm leading-relaxed">
          {blog.description}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
          <img
            src={blog.author.profilePicture || "https://placehold.co/48"}
            alt={blog.author.fullName}
            loading="lazy"
            className="w-10 h-10 rounded-full border border-gray-200 object-cover hover:border-green-500 transition-colors"
            onClick={handleAuthorClick}
          />

          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-gray-800 text-sm truncate hover:text-green-600 transition-colors"
              onClick={handleAuthorClick}
            >
              {blog.author.fullName}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1 shrink-0">
                <Calendar size={12} className="text-gray-400" />
                {formatDate(blog.createdAt)}
              </span>

              {blog.author.location?.city && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={12} className="text-gray-400" />
                  {blog.author.location.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Like Button */}
        <div className="mt-4 flex justify-end">
          <LikeButton
            isLiked={isLiked}
            likesCount={blog.likes.length}
            onClick={handleLikeClick}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
});

// Helpful for React DevTools debugging
BlogCard.displayName = "BlogCard";

export default BlogCard;
