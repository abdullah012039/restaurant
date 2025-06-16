"use client";

import { useApp } from "@/contexts/app-context";
import RestaurantLayoutWrapper from "./restaurant/layout";
import SupermarketLayoutWrapper from "./supermarket/layout";
import { Loader2 } from "lucide-react";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useApp();
  const { publicData, isLoading } = state;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!publicData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Determine layout based on the category from the API response
  const category = publicData.system.category;

  if (category === "restaurant") {
    return <RestaurantLayoutWrapper>{children}</RestaurantLayoutWrapper>;
  } else if (category === "supermarket") {
    return <SupermarketLayoutWrapper>{children}</SupermarketLayoutWrapper>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-lg text-muted-foreground">Unknown category</p>
    </div>
  );
}
