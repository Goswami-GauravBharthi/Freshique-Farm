import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PremiumFarmHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-linear-to-b from-sky-50 via-emerald-50/50 to-lime-50">
      {/* Animated Farm Background */}
      <FarmScene />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-16 sm:pt-40 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={loaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-emerald-800 text-xs font-bold tracking-wide uppercase">
                Now Harvesting Season
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
              <span className="block text-emerald-800 drop-shadow-sm">
                Harvest
              </span>
              <span className="block bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Happiness
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the taste of{" "}
              <span className="text-emerald-700 font-bold">pure nature</span>.
              Real-time farm tracking, same-day harvest, and absolutely 100%
              chemical-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
              <Link
                to="/market"
                className="group relative overflow-hidden px-8 py-4 bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-700/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-emerald-600 to-teal-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <span className="relative flex items-center gap-3">
                  Start Shopping
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </span>
              </Link>

              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-emerald-800 font-bold text-lg rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Become a Farmer
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-y-3 gap-x-6 text-sm text-slate-600 pt-4">
              {["Verified Farmers", "Carbon Neutral", "1M+ Happy Homes"].map(
                (text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-emerald-50"
                  >
                    <CheckBadge className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{text}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Right: Visuals & Composition */}
          <div className="relative order-2  flex justify-center items-center perspective-1000">
            {/* Abstract Blobs Background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center z-0"
            >
              <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-linear-to-tr from-emerald-200/40 to-lime-200/40 rounded-full blur-3xl animate-pulse" />
            </motion.div>

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              animate={loaded ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full max-w-[500px]"
            >
              {/* The Main Product Image - Masked for organic feel */}
              <div className="relative">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20 border-4 border-white/80"
                >
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                    alt="Fresh organic vegetables in a basket"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                {/* Floating Card 1: Delivery */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -top-6 -right-4 sm:-right-8 bg-white p-4 rounded-2xl shadow-lg border border-emerald-50 z-20 flex items-center gap-3"
                >
                  {/* <div className="bg-orange-100 p-2.5 rounded-full text-orange-600">
                    <TruckIcon className="w-6 h-6" />
                  </div> */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Delivery
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      Under 24 Hours
                    </p>
                  </div>
                </motion.div>

                {/* Floating Card 2: Organic Badge */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-50 z-20 flex items-center gap-3 max-w-[200px]"
                >
                  <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600">
                    <LeafIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Quality
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      100% Organic Certified
                    </p>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1135/1135528.png"
                  alt="leaf"
                  className="absolute -top-10 left-10 w-12 h-12 opacity-80 rotate-45 animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Components --- */

function FarmScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-sky-200/20 to-transparent" />

      {/* Animated Sun */}
      <div
        className="absolute top-10 right-20 w-24 h-24 md:w-32 md:h-32 
                bg-linear-to-br from-yellow-300 to-amber-400 
                rounded-full 
                shadow-lg
                shadow-yellow-400/50 
                blur-sm 
                animate-pulse"
      />
      {/* Hills SVG */}
      <svg
        className="absolute bottom-0 w-full h-48 lg:h-64 transition-all duration-500"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#86efac"
          fillOpacity="0.4"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L0,320Z"
        />
        <path
          fill="#4ade80"
          fillOpacity="0.2"
          d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,165.3C672,181,768,171,864,154.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L0,320Z"
        />
      </svg>

      {/* Birds */}
      <motion.div
        animate={{ x: [0, 100], y: [0, -30, 10] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-24 left-1/3 opacity-60"
      >
        <Bird />
      </motion.div>
    </div>
  );
}

/* --- Icons --- */

function ArrowRight({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function CheckBadge({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// function TruckIcon({ className }) {
//   return (
//     <svg
//       className={className}
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
//       />
//     </svg>
//   );
// }

function LeafIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function Bird() {
  return (
    <svg width="50" height="40" viewBox="0 0 50 40" fill="none">
      <path
        d="M10 20 Q 5 15, 0 20 Q 5 25, 10 20"
        stroke="#1f2937"
        strokeWidth="2"
      />
      <path
        d="M40 20 Q 45 15, 50 20 Q 45 25, 40 20"
        stroke="#1f2937"
        strokeWidth="2"
      />
    </svg>
  );
}
