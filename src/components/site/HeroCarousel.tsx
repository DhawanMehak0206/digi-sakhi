import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { workshopImages } from "@/lib/workshopImages";

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4500);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, align: "start" }}
      className="relative w-full overflow-hidden"
    >
      <CarouselContent className="ml-0">
        {workshopImages.map((image) => (
          <CarouselItem key={image.src} className="pl-0 basis-full">
            <div className="relative aspect-[4/3] md:aspect-[5/4] w-full overflow-hidden bg-black/20">
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
      <CarouselNext className="right-3 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
    </Carousel>
  );
}
