// components/BlogCard.jsx
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLikeBlog } from "../../../hooks/useLikeBlog";
import { useSelector } from "react-redux";
import LikeButton from "./LikeBtnFOrBlog";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const { mutate: likeBlog, isPending } = useLikeBlog();

  const {user}=useSelector((state)=>state.auth)
  const userId = user?._id;
  const isLiked = blog.likes.includes(userId);

  const handleLike = () => {
    likeBlog(blog._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/community/blog/${blog._id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition">
          {blog.title}
        </h3>

        <p className="text-gray-600 mt-3 line-clamp-3">{blog.description}</p>

        <div className="flex items-center gap-3 mt-5">
          <img
            src={blog.author.profilePicture}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-green-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/farmerPage/${blog.author._id}`);
            }}
          />
          <div>
            <p
              className="font-semibold text-gray-800 cursor-pointer hover:text-green-600"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/farmerPage/${blog.author._id}`);
              }}
            >
              {blog.author.fullName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(blog.createdAt)}
              </span>
              {blog.author.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {blog.author.location.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <LikeButton
            isLiked={isLiked}
            likesCount={blog.likes.length}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            isLoading={isPending}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;