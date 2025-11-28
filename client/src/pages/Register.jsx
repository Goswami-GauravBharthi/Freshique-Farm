import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faTag,
  faPhone,
  faImage,
  faMapMarkerAlt,
  faCity,
  faFlag,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import api, { registerUser } from "../apis/api";
import { setUser } from "../store/authSlice";

// import { setUser } from "../store/authSlice"; // Adjust path as needed

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "consumer",
    fullName: "",
    phoneNumber: "",
    profilePicture: null, // Changed to store file object
    location: {
      address: "",
      city: "Bhavnagar",
      state: "Gujarat",
      country: "India",
      zipCode: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null); // For image preview

   const { mutate, isPending } = useMutation({
     mutationFn: registerUser,
     onSuccess: async (data) => {
       if (data.success) {
         try {
           const { data: profileData } = await api.get("auth/profile");
           dispatch(setUser(profileData.user));

           if (formData.role.toLowerCase() === "farmer") {
             navigate("/farmer/dashboard/profile", { replace: false }); // Use replace to avoid history stack issues
             toast.success("Farmer registered Successfully");
           } else {
             navigate("/", { replace: true });
             toast.success("Registered Successfully");
           }
         } catch (error) {
           console.error("Error fetching profile:", error);
           toast.error("Failed to fetch user profile");
           navigate("/signup");
         }
       } else {
         toast.error(data.message);
       }
     },
     onError: (err) => {
       toast.error("Internal server error while login");
     },
   });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" }); // Clear error on change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setErrors({ ...errors, profilePicture: "" });

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.role) newErrors.role = "Role is required";
    // Location required for all roles
    if (!formData.location.address)
      newErrors["location.address"] = "Address is required";
    if (!formData.location.city) newErrors["location.city"] = "City is required";
    if (!formData.location.state)
      newErrors["location.state"] = "State is required";
    if (!formData.location.country)
      newErrors["location.country"] = "Country is required";
    if (!formData.location.zipCode)
      newErrors["location.zipCode"] = "Zip code is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix form errors");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("fullName", formData.fullName);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("location", JSON.stringify(formData.location));
      if (formData.profilePicture) {
        payload.append("profilePicture", formData.profilePicture);
      }
      
      mutate(payload);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-100 via-green-100 to-teal-100 lg:p-4">
      <div className="w-full  bg-white lg:rounded-2xl shadow-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section: Personal Information */}
          <div className="bg-green-50 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-800">
                Personal Information
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Tell us about yourself to get started
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-3 text-green-600"
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ex. Ramesh Patel"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-3 text-green-600"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-3 text-green-600"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Role */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="absolute left-3 text-green-600"
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="consumer">Consumer</option>
                    <option value="farmer">Farmer</option>
                    {/* <option value="restaurant">Restaurant</option> */}
                  </select>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="absolute left-3 text-green-600"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm border-gray-300"
                    placeholder="+91 ----"
                  />
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="absolute left-3 text-green-600"
                  />
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm border-gray-300"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Section: Location and Image Preview */}
          <div className="bg-amber-50 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-800">Location</h3>
              <p className="text-sm text-gray-600 mt-2">
                Provide your location details
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1 flex items-center">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="absolute left-3 text-amber-600"
                    />
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm ${
                        errors["location.address"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="123 Farm Street"
                    />
                  </div>
                  {errors["location.address"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["location.address"]}
                    </p>
                  )}
                </div>
                {/* City */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1 flex items-center">
                    <FontAwesomeIcon
                      icon={faCity}
                      className="absolute left-3 text-amber-600"
                    />
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      readOnly
                      className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm ${
                        errors["location.city"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Springfield"
                    />
                  </div>
                  {errors["location.city"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["location.city"]}
                    </p>
                  )}
                </div>
                {/* State */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <div className="mt-1 flex items-center">
                    <FontAwesomeIcon
                      icon={faMap}
                      className="absolute left-3 text-amber-600"
                    />
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      readOnly
                      className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm ${
                        errors["location.state"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="California"
                    />
                  </div>
                  {errors["location.state"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["location.state"]}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1 flex items-center">
                    <FontAwesomeIcon
                      icon={faFlag}
                      className="absolute left-3 text-amber-600"
                    />
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleChange}
                      readOnly
                      className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm ${
                        errors["location.country"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="USA"
                    />
                  </div>
                  {errors["location.country"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["location.country"]}
                    </p>
                  )}
                </div>
                {/* Zip Code */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <div className="mt-1 flex items-center">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="absolute left-3 text-amber-600"
                    />
                    <input
                      type="text"
                      name="location.zipCode"
                      value={formData.location.zipCode}
                      onChange={handleChange}
                      className={`pl-10 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm ${
                        errors["location.zipCode"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="90210"
                    />
                  </div>
                  {errors["location.zipCode"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["location.zipCode"]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-amber-800">
                Profile Picture Preview
              </h3>
              <div className="mt-2 flex justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-amber-500"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border-2 border-gray-300">
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-gray-400 text-2xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit and Login Link */}
          <div className="md:col-span-2 mt-6 space-y-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Register"
              )}
            </button>
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-600 hover:underline cursor-pointer font-medium"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;