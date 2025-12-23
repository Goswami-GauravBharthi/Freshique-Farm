import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { Loader2, Calendar } from "lucide-react";

const Blogs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/api/admin/blogs")).data,
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Community Blogs ({data?.count})
      </h1>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="p-4">Blog Title</th>
              <th className="p-4">Author (Farmer)</th>
              <th className="p-4">Posted Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.blogs?.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td
                  onClick={() =>
                    window.open(
                      `https://freshiquefarm.vercel.app/community/blog/${blog._id}`,"_blank"
                    )
                  }
                  className="p-4 max-w-md cursor-pointer"
                >
                  <img
                    src={blog.image}
                    className="w-18 h-12 rounded mb-2 object-cover"
                  />
                  <span className="font-medium text-gray-800 line-clamp-1">
                    {blog.title}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">
                  {blog.authorName}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
