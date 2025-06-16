// جذر layout لكل صفحات app router في Next.js
import type { ReactNode } from "react";
import DynamicLayout from "@/components/shared/DynamicLayout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DynamicLayout>{children}</DynamicLayout>
      </body>
    </html>
  );
}
