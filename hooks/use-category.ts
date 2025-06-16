// Hook to get and cache the current category (restaurant/supermarket)
import { useApp } from "@/contexts/app-context";

export function useCategory() {
  const { state } = useApp();
  return state.publicData?.system.category || null;
}
