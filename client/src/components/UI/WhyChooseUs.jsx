// components/WhyChooseUs.jsx
import { motion } from "framer-motion";
import { Leaf, Truck, Shield, Sun } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "100% Organic & Chemical-Free",
      desc: "Direct from farm, no middlemen, no pesticides",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Same-Day Harvest & Delivery",
      desc: "Picked in morning, delivered by evening",
      gradient: "from-orange-400 to-red-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guaranteed",
      desc: "Not fresh? Full refund, no questions asked",
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Support Local Farmers",
      desc: "Every order helps a farmer family directly",
      gradient: "from-yellow-400 to-amber-600",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-linear-to-b from-white to-lime-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            Why Freshique Farm?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Fresh from soil to your door — the way nature intended
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              {/* Gradient Top Bar */}
              <div className={`h-2 bg-linear-to-r ${feature.gradient}`} />

              <div className="p-6 text-center space-y-4">
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${feature.gradient} text-white shadow-xl group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Subtle Hover Glow */}
              <div className="absolute inset-0 rounded-2xl ring-4 ring-transparent group-hover:ring-emerald-200/50 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Trusted by 50,000+ families across India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
