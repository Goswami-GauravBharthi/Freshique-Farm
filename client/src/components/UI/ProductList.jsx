import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { fetchProducts } from "../../apis/api.js";
import { addToCart, fetchCart } from "../../store/cartSlice";

const ProductList = () => {
  const { searchQuery, city, category, minPrice, maxPrice } = useSelector(
    (state) => state.filters
  );

  const { error } = useSelector((state) => state.cart);

  if (error) {
    toast.error("Please Login To add Cart");
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <ProductLoading />;
  }

  const filteredProducts = data?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .trim()
      .includes(searchQuery.toLowerCase().trim());
    const matchesCity = !city || product.location.city === city;
    const matchesCategory =
      !category || product.category.toLowerCase() === category.toLowerCase();
    const matchesMinPrice =
      !minPrice || product.pricePerUnit >= parseFloat(minPrice);
    const matchesMaxPrice =
      !maxPrice || product.pricePerUnit <= parseFloat(maxPrice);

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  if (filteredProducts?.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full md:w-[90%]    mt-8 mx-auto  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4   gap-3 md:gap-6">
      {filteredProducts?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

//? ================ MODERN PRODUCT CARD ================
import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import ProductLoading from "./Loadings/ProductLoading.jsx";
import FavoriteButton from "./SingleComponent/FavoriteButton.jsx";

const ProductCard = ({ product }) => {
  const firstImage = product.photos?.[0];

  const { name, _id: productId, pricePerUnit: price, photos, unit } = product;

  const dispatch = useDispatch();

  const handleCart = async () => {
    const cartProduct = {
      productId,
      name,
      price,
      unit,
      quantity: 1,
      image: photos[0],
      farmerId: product.farmer._id,
    };

    dispatch(addToCart(cartProduct));

    dispatch(fetchCart());
  };

  return (
    <div
      className="
        group relative rounded-xl border border-gray-300 overflow-hidden
        flex flex-col h-full
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
        
        focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2
      "
    >
      {/* ---------- IMAGE ---------- */}
      <NavLink
        to={`/product/${product._id}`}
        className="w-full h-48 bg-gray-100 cursor-pointer"
      >
        {/* Heart Button - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton product={product} />
        </div>
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </NavLink>

      {/* ---------- BODY ---------- */}
      <div className="p-3 lg:p-4 flex flex-col flex-1 backdrop-blur-xl bg-white ">
        {/* Name */}
        <h3 className="text-base md:text-lg text-center font-semibold text-gray-800 line-clamp-2 capitalize mb-2">
          {product.name}
        </h3>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto">
          {/* ----- PRICE ----- */}
          <div className="flex flex-col">
            <p className="text-lg font-bold text-green-700 leading-none">
              ₹{Number(product.pricePerUnit).toFixed(2)}
            </p>
            <span className="text-xs text-gray-500">per {product.unit}</span>
          </div>

          {/* ----- ADD BUTTON ----- */}
          <button
            onClick={handleCart}
            className="
              flex items-center gap-1.5 px-3 py-1.5
              bg-linear-to-r from-green-600 to-emerald-600
              hover:from-green-700 hover:to-emerald-700
              text-white font-medium text-sm rounded-lg
              shadow-md hover:shadow-lg
              transform transition-all duration-200
              hover:-translate-y-0.5
              cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            "
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
