"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export function HeroCarousel() {
  const backgroundImages = [
    "/images/1.jpeg",
    "/images/2.jpeg",
    "/images/3.jpeg",
    "/images/4.jpeg",
    "/images/6.jpeg",
    "/images/7.jpeg",
    "/images/8.jpeg",
    "/images/9.jpeg",
    "/images/10.jpeg",
    "/images/11.jpeg",
    "/images/12.jpeg",
    "/images/13.jpeg",
    "/images/14.jpeg",
    "/images/15.jpeg",
    "/images/16.jpeg",
  ];
  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        className="h-full w-full"
      >
        {backgroundImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${img})` }}
              />
              {/* Overlay gradient */}
              <div className="bg-secondary/50 dark:bg-secondary/50 absolute inset-0"></div>
              {/* <div className="from-primary/90 via-primary/80 to-primary/70 absolute inset-0 bg-gradient-to-br opacity-80" /> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
