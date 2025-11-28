import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFilterBar from "../components/UI/FilterSection";
import ProductList from "../components/UI/ProductList";

const Marketplace = () => {
  const dispatch = useDispatch();
  

  const [showMobileFilter, setShowMobileFilter] = useState(false);


  const toggleFilter = () => {
    setShowMobileFilter((prev) => !prev);
  };

  return (
    <div className="container mx-auto p-3">
      {/* Toggle button for mobile */}
      <p
        className="sm:hidden block text-green-800 font-medium cursor-pointer pt-2"
        onClick={toggleFilter}
      >
        Filter {showMobileFilter ? "▲" : "▼"}
      </p>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
    sm:opacity-100 sm:max-h-none sm:overflow-visible
    ${showMobileFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
  `}
      >
        <SearchFilterBar />
      </div>

      <ProductList />
    </div>
  );
};

export default Marketplace;
