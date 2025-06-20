"use client"

import React, { useEffect, useState, useMemo } from "react"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ListFilter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/contexts/app-context"
import { RestaurantAPIData } from "@/lib/api"

export default function MenuPage() {
  const { state } = useApp();
  const { publicData, isLoading } = state;
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [sort, setSort] = useState<string>("relevance")
  const [selectedMax, setSelectedMax] = useState<number>(100)

  // Get menu items from context and flatten the nested structure
  const menuItems = useMemo(() => {
    if (!publicData || !('menu' in publicData)) return [];
    return Object.values((publicData as RestaurantAPIData).menu).flat();
  }, [publicData]);

  // Calculate price range
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = menuItems.map((p) => parseFloat(p.price)).filter((n) => !isNaN(n));
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 100
    };
  }, [menuItems]);

  // Update selectedMax when maxPrice changes
  useEffect(() => {
    setSelectedMax(maxPrice);
  }, [maxPrice]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(menuItems.map((p) => p.category))).filter(Boolean) as string[];
  }, [menuItems]);

  // Filtered and sorted menu items
  const sortedItems = useMemo(() => {
    // Filter items
    const filtered = menuItems.filter((item) => {
      const searchText = search.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchText);
      const matchesCategory = category === "all" || item.category === category;
      const price = parseFloat(item.price);
      const matchesRange = price >= minPrice && price <= selectedMax;
      return matchesSearch && matchesCategory && matchesRange;
    });

    // Sort items
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [menuItems, search, category, sort, minPrice, selectedMax]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!publicData || !('menu' in publicData)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-muted-foreground">No menu data available</p>
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
              placeholder="Search menu items..."
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
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    onValueChange={(value) => setSelectedMax(value[0])}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${minPrice}</span>
                    <span>${selectedMax}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedItems.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-muted-foreground">No menu items found</p>
          </div>
        ) : (
          sortedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        )}
      </div>
    </div>
  )
}
