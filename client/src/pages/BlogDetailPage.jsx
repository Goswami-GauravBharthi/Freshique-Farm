// pages/BlogDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

import LikeButton from "../components/UI/SingleComponent/LikeBtnFOrBlog";
import { useLikeBlog } from "../hooks/useLikeBlog";
import { fetchBlog } from "../apis/api";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Translation State
  const [activeLang, setActiveLang] = useState("en"); // 'en' or 'gu'
  const [gujaratiText, setGujaratiText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || null;

  const { mutate: likeBlog, isPending: isLiking } = useLikeBlog();

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const isLiked = userId ? blog?.likes?.includes(userId) : false;

  // Translate Function (Google Translate Free API)
  const translateToGujarati = async () => {
    if (!blog?.description || gujaratiText) return;

    setIsTranslating(true);
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(
          blog.description
        )}`
      );
      const data = await res.json();
      const translated = data[0].map((item) => item[0]).join("");
      setGujaratiText(translated);
    } catch (err) {
      setGujaratiText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate when switching to Gujarati
  useEffect(() => {
    if (activeLang === "gu" && !gujaratiText && !isTranslating) {
      translateToGujarati();
    }
  }, [activeLang]);

  // Error & Loading states (unchanged)
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog you're looking for may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/community")}
            className="px-8 py-4 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition"
          >
            Back to Community
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 lg:h-full bg-gray-200 rounded-2xl"></div>
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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium mb-8 transition"
        >
          <ArrowLeft size={22} />
          Back
        </motion.button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Hero Image */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-96 lg:h-full min-h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Right: Title + Farmer + Like */}
          <div className="flex flex-col justify-start space-y-4 md:space-y-8">
            {/* Farmer Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-3 md:p-6"
            >
              <div className="flex items-center gap-5">
                <img
                  src={blog.author.profilePicture}
                  alt={blog.author.fullName}
                  className="w-20 h-20 rounded-full border-4 border-green-600 object-cover cursor-pointer hover:scale-105 transition"
                  onClick={() => navigate(`/farmerPage/${blog.author._id}`)}
                />
                <div className="flex-1">
                  <p
                    className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-green-600 transition"
                    onClick={() => navigate(`/farmerPage/${blog.author._id}`)}
                  >
                    {blog.author.fullName}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={18} />
                      {formatDate(blog.createdAt)}
                    </span>
                    {blog.author.location?.city && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={18} />
                          {blog.author.location.city},{" "}
                          {blog.author.location.state}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Like Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex md:justify-center lg:justify-start"
            >
              <div className="rounded-xl cursor-pointer">
                <LikeButton
                  isLiked={isLiked}
                  likesCount={blog.likes.length}
                  onClick={() => userId && likeBlog(blog._id)}
                  isLoading={isLiking}
                />
                {!userId && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Login to like
                  </p>
                )}
              </div>
            </motion.div>

            {/* Blog Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold leading-tight bg-linear-to-r from-red-500 via-green-500 to-purple-500 text-transparent bg-clip-text"
            >
              {blog.title}
            </motion.h1>
          </div>
        </div>

        {/* Bottom: Description with Language Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 md:mt-16 w-full md:max-w-5xl md:mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 lg:p-12 border border-gray-100">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveLang("en")}
                className={`px-6 py-3 font-medium text-lg transition-colors ${
                  activeLang === "en"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang("gu")}
                className={`px-6 py-3 font-medium text-lg transition-colors flex items-center gap-2 ${
                  activeLang === "gu"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                ગુજરાતી
                {isTranslating && (
                  <span className="text-sm">(Translating...)</span>
                )}
              </button>
            </div>

            {/* Description Content */}
            <article className="prose prose-lg max-w-none text-gray-700 leading-8">
              {activeLang === "en" ? (
                <p className="whitespace-pre-line text-justify text-base lg:text-lg">
                  {blog.description}
                </p>
              ) : (
                <p
                  className="whitespace-pre-line text-justify text-base lg:text-lg"
                  style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}
                >
                  {isTranslating
                    ? "અનુવાદ કરી રહ્યા છીએ..."
                    : gujaratiText || "ગુજરાતીમાં અનુવાદ કરવા માટે ક્લિક કરો"}
                </p>
              )}
            </article>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
