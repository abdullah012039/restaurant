"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useApp } from "@/contexts/app-context"

export default function HeroSlider() {
  const { state } = useApp();
  const [baseurl, setBaseurl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { hostname } = window.location;
      const subdomain = hostname.split('.')[0];
      setBaseurl(`https://api.tarkeeb.online`);
    }
  }, []);

  const sliderImages = state.publicData?.system.slider_images || [];

  if (!sliderImages || sliderImages.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-0 10">
      <Carousel
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full p-0 pl-0"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {sliderImages.map((slide, index) => (
            <CarouselItem key={index} className="p-0 pl-0">
              <Card className="overflow-hidden border-0 shadow-none rounded-none p-0 m-0 h-[calc(100vh-200px)]">
                <CardContent className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] p-0 h-[100%] w-[100%]">
                  <Image
                    src={slide.image ? baseurl + slide.image : "/placeholder.svg"}
                    alt={slide.caption || "Slider image"}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {slide.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <h2 className="text-2xl font-bold">{slide.caption}</h2>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}

HeroSlider.defaultProps = {} // Required for Next.js
