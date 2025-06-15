"use client";

import { useApp } from "@/contexts/app-context";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { ShoppingCart, Utensils, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_BASE_URL, fetchRestaurantData } from "@/lib/data";
import {
  RestaurantAPIData,
  SliderImage as ApiSliderImage,
  MenuItem,
} from "@/lib/types";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./heroswiper.css";
import { useRouter } from "next/navigation";

// Mock data should be defined outside the component or imported
const fastFoodMenusData: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: "8.99",
    image: "/placeholder.svg?text=Burger",
    description: "Juicy beef patty with fresh veggies.",
    is_available: true,
    category: "Burgers",
    created_at: "2023-01-01T12:00:00Z",
    updated_at: "2023-01-01T12:00:00Z",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: "12.50",
    image: "/placeholder.svg?text=Pizza",
    description: "Classic pepperoni pizza.",
    is_available: true,
    category: "Pizza",
    created_at: "2023-01-01T12:00:00Z",
    updated_at: "2023-01-01T12:00:00Z",
  },
  {
    id: 3,
    name: "Fries",
    price: "3.00",
    image: "/placeholder.svg?text=Fries",
    description: "Crispy golden fries.",
    is_available: true,
    category: "Sides",
    created_at: "2023-01-01T12:00:00Z",
    updated_at: "2023-01-01T12:00:00Z",
  },
];

// Helper function to get a diverse set of popular items
const getPopularItems = (
  menu: Record<string, MenuItem[]>,
  countPerCategory: number = 2, // How many items to try to get from each category
  maxTotal: number = 6 // The absolute maximum number of items to return
): MenuItem[] => {
  if (!menu) return [];

  const popularItemsList: MenuItem[] = [];
  const categoryNames = Object.keys(menu); // e.g., ["drink", "food", "pizza"]

  for (const categoryName of categoryNames) {
    const availableItemsInCategory = menu[categoryName].filter(
      (item) => item.is_available
    );
    const itemsToTake = availableItemsInCategory.slice(0, countPerCategory);
    popularItemsList.push(...itemsToTake);
  }
  // Slice to ensure we don't exceed maxTotal. This favors categories listed earlier if the sum of items exceeds maxTotal.
  return popularItemsList.slice(0, maxTotal);
};

function SwiperNavButtons() {
  const swiper = useSwiper();
  return (
    <>
      <button
        className="custom-swiper-prev custom-swiper-arrow"
        aria-label="Previous slide"
        onClick={() => swiper.slidePrev()}
      >
        <span className="arrow-shape left" />
      </button>
      <button
        className="custom-swiper-next custom-swiper-arrow"
        aria-label="Next slide"
        onClick={() => swiper.slideNext()}
      >
        <span className="arrow-shape right" />
      </button>
    </>
  );
}

export default function KingsBurgerPage() {
  const route = useRouter();
  const { state, dispatch } = useApp();
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [restaurantData, setRestaurantData] =
    useState<RestaurantAPIData | null>(null);
  const [heroSliderData, setHeroSliderData] = useState<ApiSliderImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchRestaurantData();
        setRestaurantData(data);
        if (data.system && data.system.slider_images) {
          setHeroSliderData(
            data.system.slider_images.filter((slide) => slide.is_active)
          );
        }
        // Dispatch action to store restaurant data in context if needed by other components like menu page
        dispatch({ type: "SET_RESTAURANT_DATA", payload: data });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Failed to load restaurant data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [dispatch]);

  const categoriesData = restaurantData?.menu
    ? Object.entries(restaurantData.menu)
        .map(([categoryName, items]) => ({
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          image:
            items.length > 0 &&
            items[0].image &&
            items.find((item) => item.is_available && item.image)
              ? API_BASE_URL +
                (items.find((item) => item.is_available && item.image)?.image ||
                  items[0].image)
              : "/placeholder.svg?text=" + categoryName,
          items: items.filter((item) => item.is_available).length,
        }))
        .filter((category) => category.items > 0)
    : [];

  const nextHeroSlide = () =>
    setCurrentHeroSlide((prev) => (prev + 1) % (heroSliderData.length || 1));
  const prevHeroSlide = () =>
    setCurrentHeroSlide(
      (prev) =>
        (prev - 1 + (heroSliderData.length || 1)) % (heroSliderData.length || 1)
    );

  const handleAddToCart = (item: MenuItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: { message: `${item.name} added to cart!`, type: "success" },
    });
    console.log("Added to cart:", item.name);
  };

  // Get popular menu items for display
  const popularMenuItemsToDisplay = restaurantData?.menu
    ? getPopularItems(restaurantData.menu, 2, 6)
    : [];

  // استخراج عناصر best deal من كل التصنيفات
  const bestDealItems = restaurantData?.menu
    ? Object.values(restaurantData.menu)
        .flat()
        .filter((item) => item.is_best_deal)
    : [];

  const specialItems = restaurantData?.menu
    ? Object.values(restaurantData.menu)
        .flat()
        .filter((item) => item.is_special)
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading restaurant data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <p>No restaurant data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section
        style={{ background: "var(--section-bg-1)" }}
        className="relative flex items-center justify-center overflow-hidden min-h-[80vh]"
      >
        {heroSliderData.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{
              // Changed Autoplay to autoplay (lowercase)
              delay: 3000, // Increased delay to 3 seconds
              disableOnInteraction: false,
            }}
            navigation={false}
            pagination={{ clickable: true }}
            loop
            className="w-full h-full"
          >
            {heroSliderData.map((slide, idx) => (
              <SwiperSlide
                key={slide.image + idx + slide.caption}
                className="relative"
              >
                <div className="absolute inset-0">
                  <Image
                    src={API_BASE_URL + slide.image}
                    alt={slide.caption || `Slide ${idx + 1}`}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </div>
                <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 items-center gap-8 min-h-[80vh]">
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                      {slide.caption ||
                        restaurantData?.system.public_title ||
                        "Welcome!"}
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                      {restaurantData?.system.public_description ||
                        "Enjoy the best food in town."}
                    </p>
                    <Button
                      size="lg"
                      className="bg-brand-red hover:bg-brand-red-dark"
                    >
                      Order Now <ShoppingCart className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <SwiperNavButtons />
          </Swiper>
        ) : (
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {restaurantData?.system.public_title || "Welcome!"}
            </h1>
            <p className="text-lg md:text-xl mb-8">
              {restaurantData?.system.public_description ||
                "Enjoy the best food in town. Slider images are currently unavailable."}
            </p>
            <Button size="lg" className="bg-brand-red hover:bg-brand-red-dark">
              View Menu <Utensils className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </section>

      {/* Choose a Category Section */}
      <section style={{ background: "var(--section-bg-2)" }} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-2">
            Choose a Category
          </h2>
          <div className="w-20 h-1 bg-brand-yellow mx-auto mb-12"></div>
          <div className="flex justify-center space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
            {categoriesData.length > 0 ? (
              categoriesData.map((category) => (
                <div
                  key={category.name}
                  className="text-center flex-shrink-0 w-40 cursor-pointer"
                  onClick={() => {
                    dispatch({
                      type: "SET_SELECTED_CATEGORY",
                      payload: category.name,
                    });
                    console.log("Selected category:", category.name);
                    route.push(
                      `/menu?category=${encodeURIComponent(category.name)}`
                    );
                  }}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-3 border-4 border-white dark:border-gray-700 shadow-lg object-cover aspect-square"
                  />
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.items} Dish{category.items === 1 ? "" : "es"} in
                    the Menu
                  </p>
                </div>
              ))
            ) : (
              <p>No categories found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Special Dishes Section */}
      {specialItems.length > 0 && (
        <section
          style={{ background: "var(--section-bg-3)" }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-2">
              Special Dishes
            </h2>
            <div className="w-20 h-1 bg-brand-yellow mx-auto mb-12"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialItems.map((item) => (
                <Card
                  key={item.id}
                  className="md:col-span-1 flex flex-col md:flex-row rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
                  style={{
                  background: "var(--card-background)",
                  color: "var(--text-primary)",
                  borderRadius: "1rem",
                  border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="relative w-full md:w-1/2 h-64">
                  <Image
                    src={
                    item.image
                      ? API_BASE_URL + item.image
                      : "/placeholder.svg"
                    }
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                  {item.discount_percent && item.discount_percent > 0 && (
                    <div className="absolute top-0 left-0 bg-brand-red text-white px-3 py-1 rounded-br-xl text-sm font-bold">
                    {item.discount_percent}% Off
                    </div>
                  )}
                  </div>
                  <div className="p-6 flex flex-col justify-between md:w-1/2 bg-white dark:bg-gray-800">
                  <div >
                    <h3
                    className="text-2xl font-bold mb-3 text-center md:text-left"
                    style={{ color: "var(--primary-color)" }}
                    >
                    {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center md:text-left">
                    {item.description?.substring(0, 75) ||
                      "Delicious item"}{" "}
                    ...
                    </p>
                    <div className="flex items-center justify-center md:justify-start mb-4">
                    {item.discount_percent && item.discount_percent > 0 ? (
                      <>
                      <div className="text-lg font-normal text-gray-400 dark:text-gray-500 line-through mr-2">
                        ${item.price}
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary-color)" }}
                      >
                        ${(
                        parseFloat(item.price) *
                        (1 - item.discount_percent / 100)
                        ).toFixed(2)}
                      </div>
                      </>
                    ) : (
                      <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary-color)" }}
                      >
                      ${item.price}
                      </div>
                    )}
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-start">
                    <Button className="bg-brand-red text-white hover:bg-brand-red-dark px-6 py-3 rounded-full font-semibold">
                    Add to Cart
                    </Button>
                  </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Menu Section */}
      {/* Best Seller Deals Section */}
      {bestDealItems.length > 0 && (
        <section className="py-16" style={{ background: "var(--background)" }}>
          <div className="container mx-auto px-4 ">
            <p
              className="font-semibold text-center mb-2"
              style={{ color: "var(--primary-color)" }}
            >
              WEEKLY SPECIAL
            </p>
            <h2
              className="text-4xl font-bold text-center mb-12 "
              style={{ color: "var(--text-primary)" }}
            >
              Best Seller Deals
            </h2>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {bestDealItems.length > 0 ? (
                bestDealItems.map((item) => (
                      <Card
                      key={item.id}
                      className="md:col-span-1 rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105"
                      style={{
                        background: "var(--card-background)",
                        color: "var(--text-primary)",
                        borderRadius: "1rem",
                        border: "1px solid var(--border-color)",
                      }}
                      >
                      <div className="relative w-full h-64">
                        <Image
                        src={
                          item.image
                          ? API_BASE_URL + item.image
                          : "/placeholder.svg"
                        }
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                        />
                        {item.discount_percent && item.discount_percent > 0 && (
                        <div className="absolute top-0 left-0 bg-brand-red text-white px-3 py-1 rounded-br-xl text-sm font-bold">
                          {item.discount_percent}% Off
                        </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3
                        className="text-2xl font-bold mb-3 text-center"
                        style={{ color: "var(--primary-color)" }}
                        >
                        {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                        {item.description?.substring(0, 75) ||
                          "Delicious item"}{" "}
                        ...
                        </p>
                        <div className="flex items-center justify-center mb-4">
                        {item.discount_percent && item.discount_percent > 0 ? (
                          <>
                          <div className="text-lg font-normal text-gray-400 dark:text-gray-500 line-through mr-2">
                            ${item.price}
                          </div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: "var(--primary-color)" }}
                          >
                            ${(
                            parseFloat(item.price) *
                            (1 - item.discount_percent / 100)
                            ).toFixed(2)}
                          </div>
                          </>
                        ) : (
                          <div
                          className="text-2xl font-bold"
                          style={{ color: "var(--primary-color)" }}
                          >
                          ${item.price}
                          </div>
                        )}
                        </div>
                        <div className="flex justify-center">
                        <Button className="bg-brand-red text-white hover:bg-brand-red-dark px-6 py-3 rounded-full font-semibold">
                          Add to Cart
                        </Button>
                        </div>
                      </div>
                      </Card>
                ))
              ) : (
                <p className="col-span-3 text-center">
                  No best seller deals found.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
