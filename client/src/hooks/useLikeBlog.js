// hooks/useLikeBlog.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { likeBlogAPI } from "../apis/api";
import { useSelector } from "react-redux";


export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  const {user}=useSelector(state=>state.auth)

  const userId = user?._id;

  return useMutation({
    mutationFn: likeBlogAPI,
    onMutate: async (blogId) => {
      await queryClient.cancelQueries(["blogs"]);
      await queryClient.cancelQueries(["blog", blogId]);

      const previousBlogs = queryClient.getQueryData(["blogs"]);
      const previousBlog = queryClient.getQueryData(["blog", blogId]);

      // Optimistic update
      queryClient.setQueryData(["blogs"], (old) => {
        if (!old) return old;
        return old.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likes: blog.likes.includes(userId)
                  ? blog.likes.filter((id) => id !== userId)
                  : [...blog.likes, userId],
                likesCount: blog.likes.includes(userId)
                  ? blog.likes.length - 1
                  : blog.likes.length + 1,
              }
            : blog
        );
      });

      return { previousBlogs, previousBlog };
    },
    onError: (err, blogId, context) => {
      queryClient.setQueryData(["blogs"], context.previousBlogs);
      queryClient.setQueryData(["blog", blogId], context.previousBlog);
      toast.error("Failed to update like");
    },
    onSettled: (data, error, blogId) => {
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["blog", blogId]);
    },
  });
};


