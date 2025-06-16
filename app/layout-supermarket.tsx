import type { ReactNode } from "react";
import SupermarketRootLayout from "./supermarket/layout";

export default function SupermarketLayoutWrapper({ children }: { children: ReactNode }) {
  // Supermarket layout expects children as prop
  return <SupermarketRootLayout>{children}</SupermarketRootLayout>;
}
