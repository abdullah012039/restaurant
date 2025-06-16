"use client";

import { useApp } from "@/contexts/app-context";
import { useState } from "react";
import Image from "next/legacy/image";
import { ShoppingCart, Heart, Star, Percent, ChevronRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./heroswiper.css";
import { useRouter } from "next/navigation";
import { RestaurantAPIData, MenuItem } from "@/lib/types";
import ProductCard from "@/components/product-card";

const BASE_URL = "http://api.public.localhost:8000";

// Add custom styles
const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
`;

export default function RestaurantPage() {
  const route = useRouter();
  const { state } = useApp();
  const { publicData, isLoading } = state;
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!publicData || !('menu' in publicData)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-muted-foreground">No restaurant data available</p>
      </div>
    );
  }

  const restaurantData = publicData as RestaurantAPIData;

  // Get all menu items
  const allMenuItems = Object.values(restaurantData.menu).flat();

  // Get unique categories
  const categories = Object.keys(restaurantData.menu);

  // Get special dishes
  const specialDishes = allMenuItems.filter(item => item.is_special);

  // Get best deals (items with discount and is_best_deal)
  const bestDeals = allMenuItems.filter(item => 
    item.is_best_deal && 
    parseFloat(String(item.discount_percent || "0")) > 0
  );

  // Convert menu items to match ProductCard props
  const convertToProductCardItem = (item: MenuItem) => ({
    ...item,
    discount_percent: String(item.discount_percent || "0"),
    category_name: item.category || "Uncategorized",
    is_best_deal: item.is_best_deal || false,
    is_special: item.is_special || false,
    is_available: item.is_available || false
  });

  return (
    <>
      <style jsx global>{styles}</style>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Fade Effect */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSlideChange={(swiper) => setCurrentHeroSlide(swiper.activeIndex)}
            className="h-full w-full"
          >
            {restaurantData.system.slider_images
              .filter((slide) => slide.is_active)
              .map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <Image
                      src={`${BASE_URL}${slide.image}`}
                      alt={slide.caption}
                      layout="fill"
                      objectFit="cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                          {slide.caption}
                        </h1>
                        <Button 
                          size="lg" 
                          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                          onClick={() => route.push('/menu')}
                        >
                          Explore Our Menu
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </section>

        {/* Categories Section - Modern Grid with Equal Sizes */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Explore Our Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const items = restaurantData.menu[category];
                const firstItemWithImage = items.find((item) => item.image);

                return (
                  <div
                    key={category}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                    onClick={() => route.push(`/menu/${category.toLowerCase()}`)}
                  >
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={
                          firstItemWithImage?.image
                            ? `${BASE_URL}${firstItemWithImage.image}`
                            : "/placeholder.svg?text=" + category
                        }
                        alt={category}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-bold mb-3">{category}</h3>
                        <p className="text-white/80 text-lg mb-6">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </p>
                        <div className="flex items-center text-white/90 text-lg">
                          <span>View Menu</span>
                          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Special Dishes Section - Horizontal Scroll */}
        {specialDishes.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-muted to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Chef's Special Selection</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover our chef's carefully crafted signature dishes, prepared with the finest ingredients
                </p>
              </div>
              <div className="relative">
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
                  {specialDishes.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex-none w-[300px] snap-center transform transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
                        <div className="relative h-[200px]">
                          <Image
                            src={item.image ? `${BASE_URL}${item.image}` : "/placeholder.svg"}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              Special
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Best Deals Section - Grid with Featured Deal */}
        {bestDeals.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Today's Best Deals</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Take advantage of our exclusive offers and special discounts
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Deal */}
                {bestDeals[0] && (
                  <div className="lg:col-span-2">
                    <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
                      <div className="relative h-[400px]">
                        <Image
                          src={bestDeals[0].image ? `${BASE_URL}${bestDeals[0].image}` : "/placeholder.svg"}
                          alt={bestDeals[0].name}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <div className="flex items-center mb-4">
                            <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-lg font-bold flex items-center">
                              <Flame className="h-5 w-5 mr-2" />
                              Best Deal
                            </span>
                            <span className="ml-4 bg-red-500 text-white px-4 py-1 rounded-full text-lg font-bold">
                              {bestDeals[0].discount_percent}% OFF
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold mb-2">{bestDeals[0].name}</h3>
                          <p className="text-white/80 text-lg mb-4">
                            {bestDeals[0].description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold">
                                ${(parseFloat(bestDeals[0].price || "0") * (1 - parseFloat(bestDeals[0].discount_percent || "0") / 100)).toFixed(2)}
                              </span>
                              <span className="ml-2 text-white/60 line-through">
                                ${parseFloat(bestDeals[0].price || "0").toFixed(2)}
                              </span>
                            </div>
                            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Other Deals */}
                <div className="space-y-6">
                  {bestDeals.slice(1).map((item) => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                      <div className="flex">
                        <div className="relative w-32 h-32">
                          <Image
                            src={item.image ? `${BASE_URL}${item.image}` : "/placeholder.svg"}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center mb-2">
                            <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                              {item.discount_percent}% OFF
                            </span>
                          </div>
                          <h4 className="font-semibold mb-1">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-primary font-bold">
                                ${(parseFloat(item.price || "0") * (1 - parseFloat(item.discount_percent || "0") / 100)).toFixed(2)}
                              </span>
                              <span className="ml-1 text-muted-foreground text-sm line-through">
                                ${parseFloat(item.price || "0").toFixed(2)}
                              </span>
                            </div>
                            <Button size="sm" variant="ghost">
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
} 