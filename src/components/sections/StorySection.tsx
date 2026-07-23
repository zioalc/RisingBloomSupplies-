"use client";

import ShopHours from "@/components/layout/ShopHours";

export default function StorySection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14">
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-warm-white via-[#f3e6ec] to-[#ead7e1]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(238,106,167,0.18)_0%,_transparent_65%)]"
        aria-hidden
      />

      <div className="site-container relative z-10">
        <div className="mx-auto max-w-sm rounded-xl border border-mauve/35 bg-mauve/22 px-5 py-5 shadow-[0_8px_32px_rgba(28,23,25,0.08)] backdrop-blur-md md:max-w-md md:px-6 md:py-6">
          <ShopHours align="center" compact />
        </div>
      </div>
    </section>
  );
}
