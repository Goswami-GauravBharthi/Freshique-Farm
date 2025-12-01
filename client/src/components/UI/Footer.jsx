import { motion, useReducedMotion } from "framer-motion";
import {
  Leaf,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Tractor,
} from "lucide-react";
import { Link } from "react-router-dom";
import { memo, useMemo } from "react";

// Memoized Social Button
const SocialButton = memo(({ Icon, href = "#" }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-2.5 rounded-full text-emerald-700 shadow-md hover:bg-emerald-600 hover:text-white hover:shadow-lg transition-all duration-300 border border-emerald-100"
      aria-label="Social media link"
    >
      <Icon size={20} strokeWidth={2} />
    </motion.a>
  );
});

SocialButton.displayName = "SocialButton";

export default function FreshiqueFarmFooter() {
  const shouldReduceMotion = useReducedMotion();

  // Only animate once when footer enters view
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }),
    [shouldReduceMotion]
  );

  // Simple one-time entrance for tractor
  const tractorVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 0.8,
      transition: { duration: 1.2, ease: "easeOut", delay: 0.6 },
    },
  };

  return (
    <footer className="relative bg-linear-to-b from-sky-50 via-yellow-50 to-green-50 pt-16 md:pt-20 overflow-hidden font-sans text-emerald-900">
      {/* Light grain overlay - static, lightweight */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "200px",
        }}
        aria-hidden="true"
      />

      {/* Simplified subtle gradient blobs */}
      <div className="absolute inset-0 bg-linear-to-br from-lime-100/20 to-emerald-100/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }} // Trigger once, early
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-32"
        >
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-linear-to-br from-emerald-500 to-green-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Leaf size={28} />
              </div>
              <h2 className="text-3xl font-bold text-emerald-950">
                Freshique Farm
              </h2>
            </Link>
            <p className="text-emerald-700 text-lg leading-relaxed max-w-sm">
              Cultivating flavor, preserving nature. From our soil to your
              table.
            </p>
            <div className="flex gap-4">
              <SocialButton Icon={Instagram} href="https://instagram.com" />
              <SocialButton Icon={Facebook} href="https://facebook.com" />
              <SocialButton Icon={Twitter} href="https://twitter.com" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 lg:col-start-6"
          >
            <h3 className="text-xl font-bold text-amber-700 mb-4">Explore</h3>
            <ul className="space-y-3">
              {[
                "Our Story",
                "Seasonal Harvest",
                "Sustainability",
                "Farm Blog",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="group flex items-center gap-2 text-emerald-700 hover:text-amber-600 transition-colors font-medium"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-xl font-bold text-amber-700 mb-5">Visit Us</h3>
            <ul className="space-y-5 text-emerald-700">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Sardar Nagar
                  <br />
                  Bhavnagar, Gujarat, India
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                <a
                  href="tel:+919512993362"
                  className="hover:text-emerald-900 transition-colors"
                >
                  +91 95129 93362
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                <a
                  href="mailto:hello@freshique.com"
                  className="hover:text-emerald-900 transition-colors"
                >
                  hello@freshique.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Landscape - Simplified */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        {/* One-time tractor animation */}
        {!shouldReduceMotion && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={tractorVariants}
            className="absolute bottom-16 md:bottom-20 right-8 md:right-32 text-amber-800 opacity-70"
          >
            <Tractor size={56} />
          </motion.div>
        )}

        {/* Simplified wave (lighter than full SVG) */}
        <div className="h-32 bg-linear-to-t from-green-200/40 to-transparent" />
        <div className="h-20 bg-green-100/30" />
      </div>

      {/* Copyright */}
      <div className="relative bg-emerald-100/40 backdrop-blur-sm border-t border-emerald-200/50 py-5 text-center">
        <p className="text-emerald-800/70 text-xs font-medium tracking-wider">
          © 2025 Freshique Farm • Sustainably Grown • Delivered Fresh
        </p>
      </div>
    </footer>
  );
}
