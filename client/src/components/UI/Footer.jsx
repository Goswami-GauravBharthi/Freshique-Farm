import { motion } from "framer-motion";
import {
  Leaf,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sprout,
  Tractor,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FreshiqueFarmFooter() {
  // --- ANIMATION VARIANTS ---

  // Stagger Container: Controls the timing of children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child animating
        delayChildren: 0.2,
      },
    },
  };

  // Child Variant: The actual animation for each block
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 20 },
    },
  };

  // Floating animation for background elements
  const float = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <footer className="relative bg-linear-to-b from-sky-100 via-yellow-50 to-indigo-50 pt-18 md:pt-24 pb-0 overflow-hidden font-sans text-emerald-950">

      {/* --- ATMOSPHERIC BACKGROUND --- */}

      {/* 1. Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-lime-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent pointer-events-none" />

      {/* 2. Grain Texture (Adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* 3. Floating Decorative Elements */}
      <motion.div
        variants={float}
        animate="animate"
        className="absolute top-10 left-[5%] opacity-20 text-emerald-600 pointer-events-none"
      >
        <Leaf size={64} />
      </motion.div>
      <motion.div
        variants={float}
        animate="animate"
        className="absolute top-20 right-[10%] opacity-20 text-lime-600 pointer-events-none"
      >
        <Sprout size={80} />
      </motion.div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 md:pb-48">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }} // Triggers every time footer is 20% visible
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* 1. BRAND SECTION (4 Columns) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-linear-to-br from-emerald-500 to-green-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <Leaf size={28} fill="currentColor" className="text-white/90" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-emerald-950">
                Freshique Farm
              </h2>
            </Link>
            <p className="text-emerald-700/90 leading-relaxed text-lg max-w-sm">
              Cultivating flavor, preserving nature. From our nutrient-rich soil
              directly to your kitchen table.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialButton Icon={Instagram} />
              <SocialButton Icon={Facebook} />
              <SocialButton Icon={Twitter} />
            </div>
          </motion.div>

          {/* 2. EXPLORE LINKS (2 Columns) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 lg:col-start-6"
          >
            <h3 className="text-xl font-bold text-[#a0580a] mb-4 flex items-center gap-2">
              Explore{" "}
              <span className="h-1 w-1 rounded-full bg-amber-500"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Our Story",
                "Seasonal Harvest",
                "Sustainability",
                "Farm Blog",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="group flex items-center gap-2 font-medium text-emerald-700 hover:text-amber-600 transition-colors"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. CONTACT INFO (3 Columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-xl font-bold text-[#a0580a] mb-5 flex items-center gap-2">
              Visit Us{" "}
              <span className="h-1 w-1 rounded-full bg-amber-500"></span>
            </h3>
            <ul className="space-y-5 text-emerald-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <span>
                  Sardar nagar near
                  <br />
                  Bhavnagar, Gujrat
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="hover:text-emerald-900 cursor-pointer transition-colors">
                  +91 9512993362
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="hover:text-emerald-900 cursor-pointer transition-colors">
                  hello@freshique.com
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* --- BOTTOM LANDSCAPE (Absolute, Non-Blocking) --- */}
      <div className="absolute bottom-0 w-full z-0 pointer-events-none">
        {/* Animated Tractor Scene */}
        <div className="relative max-w-7xl mx-auto h-0">
          {/* Tractor Silhouette - Slides in */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute bottom-12 md:bottom-20 right-4 md:right-32 z-10 opacity-80"
          >
            <Tractor size={60} className="text-amber-800" />
          </motion.div>
        </div>

        {/* Scalable SVG Landscape */}
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto min-h-[120px] max-h-[200px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#86efac"
            fillOpacity="0.3"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="#22c55e"
            fillOpacity="0.15"
            d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* Copyright Bar Overlay */}
        <div className="bg-emerald-100/30 backdrop-blur-sm border-t border-emerald-200/50 py-4 pb-18 md:pb-4 px-2 text-center">
          <p className="text-emerald-800/60 text-xs font-semibold tracking-wider uppercase">
            © 2025 Freshique Farm • Sustainably Grown • Delivered Fresh
          </p>
        </div>
      </div>
    </footer>
  );
}

// Extracted Social Button for Reusability & Clean Code
function SocialButton({ Icon }) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-2.5 rounded-full text-emerald-700 shadow-md shadow-emerald-900/5 hover:bg-emerald-600 hover:text-white hover:shadow-lg transition-colors duration-300 border border-emerald-100"
    >
      <Icon size={20} strokeWidth={2} />
    </motion.a>
  );
}
