import React, { useState } from "react";
import { Trash2, Package, IndianRupeeIcon } from "lucide-react";
import { fetchFarmerProducts, deleteProductByFarmer } from "../../apis/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FarmerProducts = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchFarmerProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductByFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  if (isError) {
    toast.error(error);
  }

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      deleteMutation.mutate(selectedProductId);
    }
    // Optional callback for parent
    setShowConfirm(false);
    setSelectedProductId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedProductId(null);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data?.products?.length) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="min-h-[90vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your listed products at the farmer's market
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, onDelete }) => {
  const firstImage = product.photos[0];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IndianRupeeIcon className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900">
                {product.pricePerUnit.toFixed(2)}
              </span>
              <span className="text-xs">/ {product.unit}</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>
              {product.quantityAvailable} {product.unit} available
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(product._id)}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Product
        </button>
      </div>
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
          >
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-9 bg-gray-200 rounded-lg mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Empty State
const EmptyState = () => (
  <div className="min-h-[90vh] rounded-2xl bg-gray-50 flex items-center justify-center py-12 px-4">
    <div className="text-center">
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
      <p className="mt-1 text-sm text-gray-600">
        Start adding products to your farmer's market listing.
      </p>
    </div>
  </div>
);

// Confirmation Modal
const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Product
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProducts;
