"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WISHLIST_STORAGE_KEY = "rising-bloom-wishlist";

export type WishlistItem = {
  productId: string;
  handle?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  itemCount: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  removeManyFromWishlist: (productIds: string[]) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as WishlistItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is WishlistItem =>
        typeof item?.productId === "string" && item.productId.length > 0,
    );
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredWishlist());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const addToWishlist = useCallback((item: WishlistItem) => {
    setItems((current) => {
      if (current.some((entry) => entry.productId === item.productId)) {
        return current;
      }
      return [...current, item];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((entry) => entry.productId !== productId),
    );
  }, []);

  const removeManyFromWishlist = useCallback((productIds: string[]) => {
    if (productIds.length === 0) return;
    const removeSet = new Set(productIds);
    setItems((current) =>
      current.filter((entry) => !removeSet.has(entry.productId)),
    );
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((current) => {
      const exists = current.some(
        (entry) => entry.productId === item.productId,
      );
      if (exists) {
        return current.filter((entry) => entry.productId !== item.productId);
      }
      return [...current, item];
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      isHydrated,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      removeManyFromWishlist,
    }),
    [
      items,
      isHydrated,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      removeManyFromWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
