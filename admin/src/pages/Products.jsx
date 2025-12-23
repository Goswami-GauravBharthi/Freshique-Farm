import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { Loader2, Tag } from "lucide-react";

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/api/admin/products")).data,
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
        All Products ({data?.count})
      </h1>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Farmer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.products?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={
                      product.photos?.[0] || "https://via.placeholder.com/40"
                    }
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border bg-gray-50"
                  />
                  <span className="font-medium text-gray-800">
                    {product.name}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center w-fit gap-1">
                    <Tag size={12} /> {product.category}
                  </span>
                </td>
                <td className="p-4 font-semibold text-gray-700">
                  ₹{product.pricePerUnit}{" "}
                  <span className="text-gray-400 text-sm font-normal">
                    / {product.unit}
                  </span>
                </td>
                <td className="p-4 text-sm text-blue-600 font-medium">
                  {product.farmer?.fullName || "Unknown Farmer"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
