import { memo } from "react";
import { motion } from "framer-motion";
import { Leaf, Truck, Shield, Sun } from "lucide-react";

// 1. OPTIMIZATION: Move static data outside the component to prevent recreation on every render.
const FEATURES_DATA = [
  {
    Icon: Leaf, // Pass the component reference, not the JSX
    title: "100% Organic",
    desc: "Direct from farm, no middlemen, zero pesticides.",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "group-hover:border-green-200",
  },
  {
    Icon: Truck,
    title: "Same-Day Harvest",
    desc: "Picked in the morning, delivered by evening.",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "group-hover:border-orange-200",
  },
  {
    Icon: Shield,
    title: "Quality Guaranteed",
    desc: "Not fresh? Full refund, no questions asked.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "group-hover:border-blue-200",
  },
  {
    Icon: Sun,
    title: "Support Local",
    desc: "Every order helps a farmer family directly.",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "group-hover:border-yellow-200",
  },
];

// 2. OPTIMIZATION: Extract Card to a memoized component.
// Using CSS for hover states instead of JS animations (framer-motion) prevents mobile scroll lag.
const FeatureCard = memo(({ feature, index }) => {
  const { Icon, title, desc, color, bg, border } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Trigger slightly before element is fully in view
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all duration-300 ease-out 
                  hover:shadow-xl hover:-translate-y-2 will-change-transform ${border}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon Container with CSS Transition */}
        <div
          className={`p-4 rounded-2xl ${bg} ${color} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon size={32} strokeWidth={1.5} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white via-lime-50/30 to-white relative overflow-hidden">
      {/* Background Decor - Pure CSS for performance */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-xs mb-2 block">
            The Freshique Promise
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Why Choose <span className="text-emerald-600">Freshique?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We don't just deliver food; we deliver the farm experience directly
            to your kitchen table.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES_DATA.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>

        {/* Bottom Trust Indication */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-800 text-sm font-medium">
            <Shield className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            Trusted by 50,000+ Happy Families
          </div>
        </div>
      </div>
    </section>
  );
}
