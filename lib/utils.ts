import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = "https://api.tarkeeb.online";

export const getAbsoluteImageUrl = (relativePath?: string): string => {
  if (!relativePath) {
    return "/placeholder.svg";
  }
  return relativePath;
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
