"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sprout,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sun,
  Truck,
  HeartHandshake,
} from "lucide-react";

// --- Data & content configuration (Separation of Concerns) ---
const STATS = [
  { label: "Farmers Empowered", value: "1,200+", icon: Sprout },
  { label: "Happy Families", value: "45k+", icon: Users },
  { label: "Fresh Deliveries", value: "1M+", icon: Truck },
  { label: "Quality Checks", value: "100%", icon: ShieldCheck },
];

const VALUES = [
  {
    title: "Radical Transparency",
    desc: "Know exactly who grew your food, when it was harvested, and how it reached your table.",
    icon: Sun,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Fair Trade First",
    desc: "We ensure farmers receive 30-50% more profit than traditional wholesale markets.",
    icon: HeartHandshake,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Zero Compromise",
    desc: "If it's not fresh enough for our own families, it doesn't make it to your doorstep.",
    icon: Award,
    color: "bg-blue-100 text-blue-600",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "The Seed",
    desc: "Started with 5 farmers in a garage in Gujarat.",
  },
  {
    year: "2022",
    title: "Sprouting",
    desc: "Expanded to 500 households and launched the mobile app.",
  },
  {
    year: "2024",
    title: "The Harvest",
    desc: "Partnering with 1,200+ farmers across 3 states.",
  },
  {
    year: "2025",
    title: "Future Growth",
    desc: "Launching AI-driven crop prediction for farmers.",
  },
];

// --- Reusable Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const AboutPage = () => {
  // Parallax effect hook
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* --- SECTION 1: HERO (Cinematic & Parallax) --- */}
      <section
        ref={targetRef}
        className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-emerald-950"
      >
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          {/* Background Image Placeholder with Gradient Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/50 to-emerald-950" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/50 backdrop-blur-md border border-emerald-500/30 text-emerald-300 mb-6 text-sm font-medium">
              <Sprout size={16} /> Cultivating the Future
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Rooted in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
                Trust.
              </span>
              <br />
              Grown for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-yellow-200">
                You.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              We aren't just a marketplace. We are the bridge between the hands
              that cultivate the earth and the families that nourish the future.
            </p>
          </motion.div>
        </div>

        {/* Floating Stat Card - Glassmorphism */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute -bottom-16 md:-bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-3/4 max-w-5xl z-20"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-100">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <stat.icon className="mx-auto w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- SECTION 2: THE NARRATIVE (Text + Visuals) --- */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              The Old Way Was Broken.
              <br />
              <span className="text-emerald-600">So We Fixed It.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                For decades, the journey from farm to table was a black box.
                Products traveled thousands of kilometers, exchanged hands 5-7
                times, and lost nutrition with every passing hour.
              </p>
              <p>
                <strong className="text-slate-900">Freshique Farm</strong>{" "}
                strips away the complexity. We connect you directly to the
                source. No warehouses, no cold storage delays, no hidden
                chemicals.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <TrendingUp className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Better Prices</h4>
                  <p className="text-sm text-slate-600">
                    Farmers earn more, you pay less.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Users className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Community First</h4>
                  <p className="text-sm text-slate-600">
                    Supporting local economy directly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1595855709940-08d47919a3b2?q=80&w=2070&auto=format&fit=crop"
                alt="Farmer holding fresh produce"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-slate-100">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Freshness Guarantee
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-emerald-600">
                    24h
                  </span>
                  <span className="text-slate-600 leading-tight">
                    From Harvest
                    <br />
                    To Home
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES (Grid) --- */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Ethical Compass
            </h2>
            <p className="text-slate-600">
              We believe business can be a force for good. Here is how we
              measure our success beyond the balance sheet.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100"
              >
                <div
                  className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 4: TIMELINE (History) --- */}
      <section className="py-24 container mx-auto px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Growing Together
          </h2>

          <div className="relative border-l-2 border-emerald-200 ml-4 md:ml-0 md:space-y-12">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="mb-8 md:mb-0 relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 bg-white border-4 border-emerald-500 rounded-full z-10 group-hover:scale-150 transition-transform duration-300" />

                {/* Content */}
                <div
                  className={`md:w-[45%] ${
                    idx % 2 === 0
                      ? "md:mr-auto md:text-right"
                      : "md:ml-auto md:order-2"
                  }`}
                >
                  <span className="text-emerald-600 font-bold text-lg">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 mt-2">{item.desc}</p>
                </div>
                <div className="md:w-[45%] hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: VISUAL GALLERY (Grid Masonry Style) --- */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Life at the Farm
              </h2>
              <p className="text-emerald-200/80 max-w-md">
                Snapshots of the hard work, the lush fields, and the genuine
                smiles that power Freshique.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-white border border-white/30 px-6 py-3 rounded-full hover:bg-white hover:text-emerald-900 transition mt-6 md:mt-0">
              View Gallery <ArrowRight size={18} />
            </button>
          </div>

          {/* Simulated Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[600px]">
            <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Market"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Tomatoes"
              />
            </div>
            <div className="col-span-1 row-span-2 relative rounded-3xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=1964&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Farmer Portrait"
              />
            </div>
            <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2127&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Dairy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: CTA --- */}
      <section className="py-32 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Taste the Difference Today
            </h2>
            <p className="text-xl text-emerald-100 mb-12">
              Join thousands of families eating cleaner, fresher, and smarter.
              Get 20% off your first farm-direct order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-emerald-800 px-10 py-5 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                Start Shopping <ArrowRight size={20} />
              </button>
              <button className="bg-emerald-600/50 border border-emerald-400/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all">
                Become a Partner
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Shim (Visual Balance) */}
      <div className="h-24 bg-slate-50" />
    </div>
  );
};

export default AboutPage;
