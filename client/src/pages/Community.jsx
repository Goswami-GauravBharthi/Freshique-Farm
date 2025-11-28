// pages/CommunityPage.jsx
import { useQuery } from "@tanstack/react-query";
import BlogCard from "../components/UI/SingleComponent/BlogCard";
import { Loader2 } from "lucide-react";
import { fetchBlogs } from "../apis/api";
import { motion } from "framer-motion";



const CommunityPage = () => {
  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 border-2 border-dashed rounded-2xl h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center text-red-500 py-10">Failed to load blogs</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center text-green-700 mb-12"
        >
          Farmer Stories & Updates
        </motion.h1>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-20">
            No stories yet. Farmers will share their journey soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
