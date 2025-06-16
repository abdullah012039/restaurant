'use client'

import React, { useEffect, useState } from "react"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ListFilter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/contexts/app-context"
import { SupermarketAPIData } from "@/lib/api"

export default function ProductsPage() {
  const { state } = useApp();
  const { publicData, isLoading } = state;
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [sort, setSort] = useState<string>("relevance")

  console.log('Public Data:', publicData);
  console.log('Is Loading:', isLoading);

  // Get products from context
  const products = 'products' in (publicData || {}) ? (publicData as SupermarketAPIData).products : [];
  console.log('Products:', products);

  // Calculate price range
  const prices = products.map((p) => parseFloat(p.price)).filter((n) => !isNaN(n))
  const minProductPrice = prices.length ? Math.min(...prices) : 0
  const maxProductPrice = prices.length ? Math.max(...prices) : 100
  const [selectedMax, setSelectedMax] = useState<number>(maxProductPrice)

  useEffect(() => {
    if (publicData && 'products' in publicData) {
      console.log('Processing products in useEffect');
      // Extract unique categories from products
      const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean)
      console.log('Categories:', uniqueCategories);
      setCategories(uniqueCategories as string[])

      // Update price range
      const newPrices = products.map((p) => parseFloat(p.price)).filter((n) => !isNaN(n))
      const minP = newPrices.length ? Math.min(...newPrices) : 0
      const maxP = newPrices.length ? Math.max(...newPrices) : 100
      setSelectedMax(maxP)
    }
  }, [publicData, products])

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(searchText)
    const matchesCategory = category === "all" || product.category === category
    const price = parseFloat(product.price)
    const matchesRange = price >= minProductPrice && price <= selectedMax
    return matchesSearch && matchesCategory && matchesRange
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price)
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price)
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  console.log('Filtered Products:', filteredProducts);
  console.log('Sorted Products:', sortedProducts);

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
        <p className="text-lg text-muted-foreground">No products data available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <ListFilter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={[selectedMax]}
                    min={minProductPrice}
                    max={maxProductPrice}
                    step={1}
                    onValueChange={(value) => setSelectedMax(value[0])}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${minProductPrice}</span>
                    <span>${selectedMax}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
