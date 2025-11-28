import React from 'react'

function ProductLoading() {
  return (
    <div className="min-h-[85vh] bg-linear-to-br from-green-100 via-emerald-100 to-lime-100 flex items-center justify-center">
      <div className="text-center">
        {/* Tractor SVG with moving wheels */}
        <div className="relative mb-8">
          <svg
            width="180"
            height="120"
            viewBox="0 0 180 120"
            className="mx-auto"
          >
            {/* Tractor body */}
            <g className="animate-pulse">
              <rect
                x="50"
                y="50"
                width="90"
                height="40"
                rx="8"
                fill="#16a34a"
              />
              <rect
                x="110"
                y="40"
                width="30"
                height="25"
                rx="4"
                fill="#15803d"
              />
              <circle cx="70" cy="95" r="18" fill="#1f2937" />
              <circle cx="70" cy="95" r="10" fill="#374151" />
              <circle cx="130" cy="95" r="25" fill="#1f2937" />
              <circle cx="130" cy="95" r="15" fill="#374151" />

              {/* Moving wheel animation */}
              <circle
                cx="70"
                cy="95"
                r="6"
                fill="#fbbf24"
                className="animate-spin"
              />
              <circle
                cx="130"
                cy="95"
                r="9"
                fill="#fbbf24"
                className="animate-spin"
              />
            </g>

            {/* Farmer hat on top */}
            <ellipse cx="95" cy="40" rx="35" ry="8" fill="#92400e" />
            <rect x="75" y="25" width="40" height="15" rx="4" fill="#92400e" />
          </svg>

          {/* Growing plants below */}
          <div className="flex justify-center gap-4 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 bg-green-600 rounded-t-full origin-bottom animate-grow"
                style={{
                  height: "40px",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <p className="text-3xl font-semibold text-green-800 mb-2">
          Cultivating Your Data...
        </p>
        <p className="text-xl font-bold text-green-600">
          Harvesting fresh data just for you 🌾
        </p>
      </div>

      <style jsx>{`
        @keyframes grow {
          0% {
            transform: scaleY(0.1);
          }
          60% {
            transform: scaleY(1.2);
          }
          100% {
            transform: scaleY(1);
          }
        }
        .animate-grow {
          animation: grow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ProductLoading