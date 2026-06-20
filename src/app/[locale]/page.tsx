import AboutSection from "@/components/sections/AboutSection";
import EmailSignupSection from "@/components/sections/EmailSignupSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import HeroSection from "@/components/sections/HeroSection";
import InstagramSection from "@/components/sections/InstagramSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import ShopCategoriesSection from "@/components/sections/ShopCategoriesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <FeaturedProductsSection />
      <ShopCategoriesSection />
      <AboutSection />
      <EmailSignupSection />
      <InstagramSection />
    </>
  );
}
