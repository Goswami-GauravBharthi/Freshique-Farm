// src/pages/farmer/FarmerCommunity.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Send,
  RefreshCw,
  Calendar,
  Trash2,
} from "lucide-react";
import { createBlog, deleteBlog, getMyBlogs } from "../../apis/api";

const FarmerCommunity = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["myBlogs"],
    queryFn: getMyBlogs,
  });

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["myBlogs"]);
      toast.success("Posted successfully!");
      setTitle("");
      setDescription("");
      setImage("");
    },
    onError: () => toast.error("Failed to post"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["myBlogs"]);
      toast.success("Deleted");
    },
  });

  const generateImage = async() => {
    if (!title.trim()) return toast.error("Enter title first");

    setGenerating(true);
    const seed = Date.now();
    const prompt = encodeURIComponent(
      `Indian farmer, ${title}, agriculture, realistic, natural light`
    );
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&seed=${seed}&nologo=true&enhance=true`;

    setTimeout(() => {
      setImage(url);
      setGenerating(false);
      toast.success("Image ready!");
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return toast.error("Generate image first");
    createMutation.mutate({ title, description, image });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-300 rounded-2xl md:p-5">
        {/* Header */}
        <div className="bg-white border-b md:rounded-2xl border-gray-200 px-6 py-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-green-900">Share Your Story</h1>
          <button
            onClick={() => setShowMyPosts(true)}
            className="px-5 py-2.5 bg-green-600 cursor-pointer text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-2"
          >
            My Posts ({blogs.length})
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-full mx-auto ">
          <div className="bg-white md:rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="Title of your story..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-b-2 border-transparent focus:border-green-500 focus:outline-none transition pb-3"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <textarea
                  placeholder="Write your experience, tips, or advice for fellow farmers..."
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-gray-700 text-lg leading-relaxed resize-none focus:outline-none placeholder-gray-400"
                  required
                />
              </div>

              {/* Image Area */}
              <div className="space-y-4">
                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    {generating ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-green-600" />
                        <p className="text-gray-600">Generating image...</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-16 h-16 mb-3" />
                        <p>Your AI-generated image will appear here</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden group">
                    <img
                      src={image}
                      alt="Generated"
                      className="w-full rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={generateImage}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition flex items-center gap-2 font-medium"
                    >
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={generateImage}
                  disabled={generating || !title}
                  className="w-full py-4 bg-linear-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <Loader2 className="animate-spin" /> Generating Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Image from Title
                    </>
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createMutation.isPending || !image}
                className="w-full py-5 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send className="w-6 h-6" /> Publish Story
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* My Posts Modal */}
        <AnimatePresence>
          {showMyPosts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowMyPosts(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Posts ({blogs.length})
                  </h2>
                  <button
                    onClick={() => setShowMyPosts(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600" />
                    </div>
                  ) : blogs.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No posts yet
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {blogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-gray-900 flex-1 pr-4">
                                {blog.title}
                              </h3>
                              <button
                                onClick={() => {
                                  if (window.confirm("Delete this post?")) {
                                    deleteMutation.mutate(blog._id);
                                  }
                                }}
                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {blog.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FarmerCommunity;
