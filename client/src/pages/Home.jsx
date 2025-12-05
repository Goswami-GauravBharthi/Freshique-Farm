import React, { Suspense, lazy } from "react";
import HeroBannerSwiper from "../components/UI/HeroBanner"; // Critical Component: Import normally


const HeroSwiper = lazy(() => import("../components/UI/Hero"));
const WhyChooseUs = lazy(() => import("../components/UI/WhyChooseUs"));
const TopFarmersSection = lazy(() =>
  import("../components/UI/home/TopFarmerSection")
);

const SectionLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function Home() {
  return (
    <div className="overflow-hidden bg-white">
      {/* 2. OPTIMIZATION: Critical Rendering Path
         Load the Main Banner immediately so LCP (Largest Contentful Paint) is fast.
      */}
      <section className="relative z-10">
        <HeroBannerSwiper />
      </section>

      {/* 3. OPTIMIZATION: Suspense Boundaries
         Wrap secondary sections in Suspense. React will load them in the background.
      */}

      {/* Secondary Hero */}
      <Suspense fallback={<div className="h-40 bg-lime-50" />}>
        <section className="relative z-0">
          <HeroSwiper />
        </section>
      </Suspense>

      {/* Why Choose Us - CSS Optimization for Rendering */}
      {/* content-visibility: auto -> Skips rendering calculations if off-screen */}
      <Suspense fallback={<SectionLoader />}>
        <section
          className="min-h-[400px]"
          style={{ contentVisibility: "auto", containIntrinsicSize: "400px" }}
        >
          <WhyChooseUs />
        </section>
      </Suspense>

      {/* Top Farmers */}
      <Suspense fallback={<SectionLoader />}>
        <section
          className="min-h-[500px]"
          style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }}
        >
          <TopFarmersSection />
        </section>
      </Suspense>
    </div>
  );
}

export default Home;
