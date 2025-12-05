import React, { useState, memo } from "react";
import { Filter } from "lucide-react"; // Assuming you have lucide-react, or use standard text
import SearchFilterBar from "../components/UI/FilterSection";
import ProductList from "../components/UI/ProductList";


const MemoizedProductList = memo(ProductList);

const Marketplace = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="container mx-auto p-3 min-h-screen">
      {/* Mobile Toggle Button */}
     
      <div className="sm:hidden block pt-2 mb-4">
        <button
          onClick={() => setShowMobileFilter((prev) => !prev)}
          className="flex items-center gap-2 text-green-800 font-bold bg-green-50 px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-sm border border-green-100"
        >
          <Filter size={16} />
          Filters
          <span className="text-xs ml-1">{showMobileFilter ? "▲" : "▼"}</span>
        </button>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out will-change-[max-height,opacity]
          sm:opacity-100 sm:max-h-none sm:overflow-visible sm:mb-8
          ${
            showMobileFilter
              ? "max-h-[800px] opacity-100 mb-6"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <SearchFilterBar />
      </div>

      <div
        className="relative"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1000px" }}
      >
        <MemoizedProductList />
      </div>
    </div>
  );
};

export default Marketplace;
