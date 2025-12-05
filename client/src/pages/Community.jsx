// pages/CommunityPage.jsx
import { useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import BlogCard from "../components/UI/SingleComponent/BlogCard";
import { fetchBlogs } from "../apis/api";

// 1. OPTIMIZATION: Create static variables outside the component
// This prevents memory allocation on every render
const SKELETON_ARRAY = Array(6).fill(0);

// 2. OPTIMIZATION: Memoized Animated Wrapper
// This ensures that only the card coming into view uses CPU resources
const BlogItem = memo(({ blog, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Reduced Y distance for smoother mobile performance
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Only animates when scrolled into view
      transition={{
        duration: 0.5,
        delay: index < 6 ? index * 0.1 : 0, // Only stagger the first 6 items, load the rest instantly
      }}
      className="h-full will-change-transform" // CSS hint for GPU acceleration
    >
      <BlogCard blog={blog} />
    </motion.div>
  );
});

// Display name for debugging
BlogItem.displayName = "BlogItem";

const CommunityPage = () => {
  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 10, // 3. OPTIMIZATION: Cache data for 10 minutes to prevent flickering
    refetchOnWindowFocus: false, // Prevents mobile lag when switching tabs
  });

  // 4. OPTIMIZATION: Memoize the loading state
  // This completely prevents re-renders of the skeleton UI
  const LoadingSkeleton = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
        {SKELETON_ARRAY.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl h-96 animate-pulse"
          />
        ))}
      </div>
    ),
    []
  );

  if (isLoading) return LoadingSkeleton;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <p className="text-red-500 text-lg font-medium">
          Failed to load stories
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Animation - Simplified */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-12"
        >
          Farmer Stories & Updates
        </motion.h1>

        {blogs.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-xl py-20 bg-white rounded-2xl shadow-sm"
          >
            No stories yet. Farmers will share their journey soon!
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map((blog, index) => (
              <BlogItem key={blog._id} blog={blog} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
