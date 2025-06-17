import { RestaurantAPIData } from './types';

export interface SupermarketAPIData {
  system: {
    id: number;
    name: string;
    description: string;
    category: string;
    custom_domain: string | null;
    logo: string;
    public_title: string;
    public_description: string;
    primary_color: string;
    secondary_color: string;
    custom_link: string | null;
    design_settings: {
      primary_color: string;
      secondary_color: string;
      background: string;
      foreground: string;
      border: string;
      radius: string;
    };
    whatsapp_number: string;
    social_links: Record<string, string>;
    slider_images: Array<{
      image: string;
      caption: string;
      is_active: boolean;
    }>;
  };
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    expiry_date: string;
    minimum_stock: number;
    barcode: string;
    image: string | null;
    category: string;
    is_available: boolean;
  }>;
}

export type PublicAPIData = RestaurantAPIData | SupermarketAPIData;

// Global cache to store API responses
let apiCache: {
  [key: string]: {
    data: PublicAPIData;
    timestamp: number;
  };
} = {};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function getBaseUrl(): string {
  if (typeof window === "undefined") return "";
  const { hostname } = window.location;
  const subdomain = hostname.split(".")[0];
  return `http://api.tarkeeb.online`;
}

export async function fetchPublicData(): Promise<PublicAPIData> {
  // Extract subdomain from window.location.hostname
  const { hostname } = window.location;
  const subdomain = hostname.split(".")[0]; // Assumes subdomain.domain.tld

  const headers = new Headers();
  headers.append("x-subdomain", subdomain);
  const baseUrl = getBaseUrl();
  const cacheKey = baseUrl;

  // Check if we have a valid cached response
  const cachedResponse = apiCache[cacheKey];
  const now = Date.now();

  if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION) {
    console.log("Using cached API response");
    return cachedResponse.data;
  }

  try {
    const response = await fetch(`${baseUrl}/public/`, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store in cache
    apiCache[cacheKey] = {
      data,
      timestamp: now
    };

    return data;
  } catch (error) {
    console.error("Error fetching public data:", error);
    throw error;
  }
} 