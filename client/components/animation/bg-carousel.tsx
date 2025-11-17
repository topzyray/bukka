"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export function BackgroundCarousel() {
  const backgroundImages = [
    "/foods/nsala-soup-with-eba.webp",
    "/foods/semo-with-efo.jpg",
    "/foods/fried-rice-with-chicken.jpg",
    "/foods/ganished-jollof.jpg",
    "/foods/yam-plaintain-chicken-with-sauces.jpg",
    "/foods/jollof-with-full-chicken.jpg",
    "/foods/meat-potato-pepper-soup.jpg",
    "/foods/sliced-chicken-buckwheat.jpg",
    "/foods/traditional-meat-with-greens-rice.jpg",
  ];
  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        className="h-full w-full"
      >
        {backgroundImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${img})` }}
              />

              {/* <div className="bg-secondary/50 dark:bg-secondary/50 absolute inset-0"></div> */}
              <div className="from-primary/90 via-primary/80 to-primary/70 dark:from-muted-foreground/90 dark:via-muted-foreground/80 dark:to-muted-foreground/70 absolute inset-0 bg-gradient-to-br opacity-80" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
