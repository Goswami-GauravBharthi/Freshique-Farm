// src/pages/AddProduct.js
import { DiamondPlus, IndianRupee } from "lucide-react";
import React, { useEffect, useState } from "react";
import { addProductByFarmer } from "../../apis/api";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    photos: [],
    quantityAvailable: "",
    unit: "",
    pricePerUnit: "",
  });

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.photos.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("category", formData.category);
    submissionData.append("quantityAvailable", formData.quantityAvailable);
    submissionData.append("unit", formData.unit);
    submissionData.append("pricePerUnit", formData.pricePerUnit);
    formData.photos.forEach((photo, index) => {
      submissionData.append(`photo${index}`, photo);
    });

    const res = await addProductByFarmer(submissionData);

    if (res.success) {
      toast.success("Product added successfully");
      setFormData({
        name: "",
        description: "",
        category: "",
        photos: [],
        quantityAvailable: "",
        unit: "",
        pricePerUnit: "",
      });
      setImagePreviews([]);
      setIsLoading(false);
    } else {
      toast.error("Failed to add product");
      setIsLoading(false);
    }
  };

  return (
    <div className=" w-full bg-slate-100 rounded-2xl shadow-xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-8 flex items-center justify-center gap-2">
        <span className="text-3xl">
          <DiamondPlus strokeWidth={2.25} />
        </span>{" "}
        Add New Farm Product
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
      >
        {/* Product Name (Full Width) */}
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
          >
            <span className="text-green-600">📛</span> Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200"
            placeholder="e.g., Organic Apples"
          />
        </div>

        {/* Description (Full Width) */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
          >
            <span className="text-green-600">📝</span> Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-base transition-all duration-200"
            placeholder="Describe your product..."
          ></textarea>
        </div>

        {/* Category and Unit (Combined in one row on md+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:col-span-2">
          <div>
            <label
              htmlFor="category"
              className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
            >
              <span className="text-green-600">🌾</span> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-base transition-all duration-200"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="grains">Grains</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="unit"
              className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
            >
              <span className="text-green-600">⚖️</span> Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
              className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200"
            >
              <option value="" disabled>
                Select a unit
              </option>
              <option value="kg">Kilograms (kg)</option>
              <option value="gram">Gram (200)</option>
              <option value="liters">Liters</option>
              <option value="pieces">Pieces</option>
            </select>
          </div>
        </div>

        {/* Quantity and Price (Combined in one row on md+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:col-span-2">
          <div>
            <label
              htmlFor="quantityAvailable"
              className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
            >
              <span className="text-green-600">📦</span> Quantity Available
            </label>
            <input
              type="number"
              id="quantityAvailable"
              name="quantityAvailable"
              value={formData.quantityAvailable}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-base transition-all duration-200"
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label
              htmlFor="pricePerUnit"
              className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
            >
              <span className="text-green-600">
                <IndianRupee strokeWidth={2} className="h-5 text-green-500" />
              </span>
              Price Per Unit{" "}
            </label>
            <input
              type="number"
              id="pricePerUnit"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full bg-white rounded-lg border border-gray-300 shadow-md p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-base transition-all duration-200"
              placeholder="e.g., 2.50"
            />
          </div>
        </div>

        {/* Image Upload (Full Width) */}
        <div className="md:col-span-2">
          <label
            htmlFor="photos"
            className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1"
          >
            <span className="text-green-600">📸</span> Product Images (Up to 4)
          </label>
          <label
            htmlFor="photos"
            className="flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="space-y-2 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="font-medium text-green-600 hover:text-green-500">
                  Upload files
                </span>
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only bg-white"
                />
                <span className="pl-1">or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-28 object-cover rounded-md shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button (Full Width) */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>➕</span> Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
