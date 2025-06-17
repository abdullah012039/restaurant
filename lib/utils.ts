import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = "https://api.tarkeeb.online";

export const getAbsoluteImageUrl = (relativePath?: string): string => {
  if (relativePath && relativePath.startsWith("/")) {
    try {
      new URL(relativePath);
      return relativePath; // It's already a full URL
    } catch (_) {
      // Not a full URL, proceed to prepend API_BASE_URL
      return `${API_BASE_URL}${relativePath}`;
    }
  }
  // Return a default placeholder or the original path if it's not a valid relative path starting with '/'
  // or if it's an empty string, null, or undefined.
  return relativePath && !relativePath.startsWith("/")
    ? relativePath
    : "/placeholder.svg";
};

export async function fetchPublicView() {
  // Extract subdomain from window.location.hostname
  const { hostname } = window.location;
  const subdomain = hostname.split(".")[0]; // Assumes subdomain.domain.tld

  const headers = new Headers();
  headers.append("x-subdomain", subdomain);

  const response = await fetch("https://api.tarkeeb.online/public/", {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public view");
  }

  return response.json();
}
