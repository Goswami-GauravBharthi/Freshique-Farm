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
      <section className="relative z-10">
        <HeroBannerSwiper />
      </section>

      {/* Secondary Hero */}
      <Suspense fallback={<div className="h-40 bg-lime-50" />}>
        <section className="relative z-0">
          <HeroSwiper />
        </section>
      </Suspense>

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
          className="min-h-[500px] "
          style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }}
        >
          <TopFarmersSection />
        </section>
      </Suspense>
    </div>
  );
}

export default Home;
