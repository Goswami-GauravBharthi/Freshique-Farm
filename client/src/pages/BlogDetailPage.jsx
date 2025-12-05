import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

import LikeButton from "../components/UI/SingleComponent/LikeBtnFOrBlog";
import { useLikeBlog } from "../hooks/useLikeBlog";
import { fetchBlog } from "../apis/api";

// 1. OPTIMIZATION: Efficient Date Formatter (Created once outside component)
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateFormatter.format(new Date(dateString));
};

// 2. OPTIMIZATION: Memoized Skeleton to prevent re-renders during loading
const BlogSkeleton = memo(() => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-96 lg:h-[500px] bg-gray-200 rounded-2xl"></div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded w-4/5"></div>
          <div className="flex gap-5">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  </div>
));

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [activeLang, setActiveLang] = useState("en");
  const [gujaratiText, setGujaratiText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Redux - Select specific data
  const userId = useSelector((state) => state.auth.user?._id);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlog();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id),
    staleTime: 1000 * 60 * 10, // Cache for 10 mins
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 3. OPTIMIZATION: Memoize derived calculation
  const isLiked = useMemo(
    () => (userId && blog?.likes ? blog.likes.includes(userId) : false),
    [userId, blog?.likes]
  );

  // 4. OPTIMIZATION: Translation with Session Storage Caching
  const translateToGujarati = useCallback(async () => {
    if (!blog?.description) return;

    // Check Cache first
    const cacheKey = `blog_gu_${id}`;
    const cachedTranslation = sessionStorage.getItem(cacheKey);

    if (cachedTranslation) {
      setGujaratiText(cachedTranslation);
      return;
    }

    setIsTranslating(true);
    try {
      // Note: In production, moving this to backend is better to avoid CORS/Rate limits
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(
          blog.description
        )}`
      );
      const data = await res.json();
      const translated = data[0].map((item) => item[0]).join("");

      setGujaratiText(translated);
      sessionStorage.setItem(cacheKey, translated); // Save to cache
    } catch (err) {
      console.error("Translation Error:", err);
      setGujaratiText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  }, [blog?.description, id]);

  useEffect(() => {
    if (activeLang === "gu" && !gujaratiText && !isTranslating) {
      translateToGujarati();
    }
  }, [activeLang, gujaratiText, isTranslating, translateToGujarati]);

  // Handlers
  const handleBack = useCallback(() => navigate(-1), [navigate]);
  const handleAuthorClick = useCallback(
    () => navigate(`/farmerPage/${blog?.author?._id}`),
    [navigate, blog?.author?._id]
  );
  const handleLike = useCallback(
    () => userId && likeBlog(blog._id),
    [userId, likeBlog, blog?._id]
  );

  if (isLoading) return <BlogSkeleton />;

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Blog Not Found
          </h1>
          <button
            onClick={() => navigate("/community")}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={22} />
          Back
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* 5. OPTIMIZATION: LCP Optimization for Mobile */}
            <img
              src={blog.image}
              alt={blog.title}
              fetchPriority="high" // Prioritize this download
              decoding="async" // Don't block main thread
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl bg-gray-100"
            />
          </motion.div>

          {/* Right: Title + Farmer + Like */}
          <div className="flex flex-col justify-start space-y-4 md:space-y-8">
            {/* Farmer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <img
                  src={blog.author.profilePicture || "https://placehold.co/100"}
                  alt={blog.author.fullName}
                  loading="lazy"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-green-600 object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={handleAuthorClick}
                />
                <div className="flex-1">
                  <p
                    className="text-xl md:text-2xl font-bold text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={handleAuthorClick}
                  >
                    {blog.author.fullName}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600 mt-1 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(blog.createdAt)}
                    </span>
                    {blog.author.location?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {blog.author.location.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Like Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex md:justify-center lg:justify-start"
            >
              <div className="rounded-xl">
                <LikeButton
                  isLiked={isLiked}
                  likesCount={blog.likes.length}
                  onClick={handleLike}
                  isLoading={isLiking}
                />
              </div>
            </motion.div>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-linear-to-r from-red-500 via-green-600 to-purple-600 text-transparent bg-clip-text">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Bottom: Description with Language Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 md:mt-16 w-full md:max-w-5xl md:mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 lg:p-12 border border-gray-100">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveLang("en")}
                className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${
                  activeLang === "en"
                    ? "text-green-600 border-green-600"
                    : "text-gray-500 border-transparent hover:text-green-600"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang("gu")}
                className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 flex items-center gap-2 ${
                  activeLang === "gu"
                    ? "text-green-600 border-green-600"
                    : "text-gray-500 border-transparent hover:text-green-600"
                }`}
              >
                ગુજરાતી
                {isTranslating && (
                  <span className="text-xs animate-pulse">
                    (Translating...)
                  </span>
                )}
              </button>
            </div>

            {/* Description Content */}
            <article className="prose prose-lg max-w-none text-gray-700 leading-8">
              {/*  
                 Note: Conceptually shows how the text is processed if backend translation were used 
               */}
              <p
                className="whitespace-pre-line text-justify text-base lg:text-lg min-h-[200px]"
                style={
                  activeLang === "gu"
                    ? { fontFamily: "'Noto Sans Gujarati', sans-serif" }
                    : {}
                }
              >
                {activeLang === "en"
                  ? blog.description
                  : gujaratiText ||
                    (isTranslating
                      ? "અનુવાદ કરી રહ્યા છીએ..."
                      : "ગુજરાતીમાં અનુવાદ કરવા માટે ક્લિક કરો")}
              </p>
            </article>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
