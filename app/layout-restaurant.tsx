import type { ReactNode } from "react";
import RestaurantRootLayout from "./restaurant/layout";

export default function RestaurantLayoutWrapper({ children }: { children: ReactNode }) {
  // Restaurant layout expects children as prop
  return <RestaurantRootLayout>{children}</RestaurantRootLayout>;
}
