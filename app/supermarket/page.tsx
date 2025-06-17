"use client"

import { useApp } from "@/contexts/app-context"
import { useState } from "react"
import Image from "next/legacy/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./heroswiper.css"
import { useRouter } from "next/navigation"
import { SupermarketAPIData, Product, SliderImage } from "@/lib/types"

const BASE_URL = "https://api.tarkeeb.online"

export default function SupermarketPage() {
  const route = useRouter()
  const { state } = useApp()
  const { publicData, isLoading } = state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!publicData || !('products' in publicData)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-muted-foreground">No supermarket data available</p>
      </div>
    )
  }

  const supermarketData = publicData as SupermarketAPIData
  console.log('Supermarket Data:', supermarketData)

  // Get unique categories from products, filtering out undefined/null categories
  const categories = Array.from(
    new Set(
      supermarketData.products
        .map((product) => product.category)
        .filter((category): category is string => !!category)
    )
  )

  console.log('Categories:', categories);

  const categoriesData = categories.map((categoryName) => {
    const productsInCategory = supermarketData.products.filter(
      (product) => product.category === categoryName
    )

    const firstProductWithImage = productsInCategory.find(
      (product) => product.image
    )

    return {
      name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      image: firstProductWithImage?.image
        ? `${BASE_URL}${firstProductWithImage.image}`
        : "/placeholder.svg?text=" + categoryName,
      items: productsInCategory.length,
    }
  })

  console.log('Categories Data:', categoriesData);

  // Get featured products (first 8 available products)
  const featuredProducts = supermarketData.products
    .filter((product) => {
      // Ensure product has all required fields
      if (!product || typeof product !== 'object') return false;
      if (!product.name || !product.price) return false;
      return true;
    })
    .slice(0, 8)

  console.log('Featured Products:', featuredProducts)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Swiper */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onSlideChange={(swiper) => setCurrentHeroSlide(swiper.activeIndex)}
          className="h-full w-full"
        >
          {supermarketData.system.slider_images
            .filter((slide: SliderImage) => slide.is_active)
            .map((slide: SliderImage, index: number) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image
                    src={`${BASE_URL}${slide.image}`}
                    alt={slide.caption}
                    layout="fill"
                    objectFit="cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white md:text-6xl">
                      {slide.caption}
                    </h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Product Categories</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {categoriesData.map((category) => (
            <div
              key={category.name}
              className="group relative flex flex-col items-center cursor-pointer"
              onClick={() => route.push(`/products/${category.name.toLowerCase()}`)}
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 transition-all group-hover:border-primary">
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.items} {category.items === 1 ? "item" : "items"}
                </p>
          </div>
          </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
          {featuredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">No featured products available</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image ? `${BASE_URL}${product.image}` : "/placeholder.svg"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            // Add to favorites logic
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            // Add to cart logic
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
            </div>
            </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
