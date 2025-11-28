import React from "react";
import HeroSwiper from "../components/UI/Hero";
import HeroBannerSwiper from "../components/UI/HeroBanner";
import WhyChooseUs from "../components/UI/WhyChooseUs";
import TopFarmersSection from "../components/UI/home/TopFarmerSection";

function Home() {
  return (
    <div>
      <HeroBannerSwiper />
      <HeroSwiper />
      <WhyChooseUs />
      <TopFarmersSection />
    </div>
  );
}

export default Home;
