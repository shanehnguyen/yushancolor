"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartLineItem, Product } from "@/lib/types";
import { submitWeb3Form } from "@/lib/web3forms";

const STORAGE_KEY = "yushan-cart";
export const FREE_SHIP_THRESHOLD = 80;

type AddInput = {
  productId: string;
  variantId?: string | null;
  name: string;
  unitPrice: number;
  variantLabel?: string;
  qty?: number;
};

type CartContextValue = {
  items: CartLineItem[];
  open: boolean;
  totalQty: number;
  subtotal: number;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  pickUpsell: (products: Product[]) => Product | undefined;
  checkout: (email: string) => Promise<{ ok: boolean; message: string }>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: AddInput) => {
    const key = `${item.productId}:${item.variantId || ""}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + (item.qty || 1) } : i));
      }
      return [...prev, { key, qty: item.qty || 1, productId: item.productId, variantId: item.variantId ?? null, name: item.name, unitPrice: item.unitPrice, variantLabel: item.variantLabel }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, []);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0), [items]);
  const totalQty = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const pickUpsell = useCallback(
    (products: Product[]) => {
      const hasTrial = items.some((i) => i.productId === "dot-card");
      const id = items.length === 0 || !hasTrial ? "dot-card" : "puli-block";
      return products.find((p) => p.id === id);
    },
    [items]
  );

  const checkout = useCallback(
    async (email: string) => {
      if (items.length === 0) return { ok: false, message: "Your cart is empty." };
      const order = "YSH-" + Math.floor(100000 + Math.random() * 900000);
      const lines = items
        .map((i) => `${i.qty}x ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""}: $${(i.unitPrice * i.qty).toFixed(2)}`)
        .join("\n");
      let confirmed = false;
      try {
        const result = await submitWeb3Form({
          subject: `Yushan: Order ${order}`,
          from_name: "Yushan checkout",
          email,
          order,
          message: `Order ${order}\n\n${lines}\n\nSubtotal: $${subtotal.toFixed(2)}`,
        });
        confirmed = !!result.success;
      } catch {
        confirmed = false;
      }
      const params = new URLSearchParams({
        order,
        items: String(totalQty),
        subtotal: subtotal.toFixed(2),
        email,
        confirmed: String(confirmed),
      });
      setItems([]);
      setOpen(false);
      router.push(`/thank-you?${params.toString()}`);
      return { ok: true, message: "" };
    },
    [items, subtotal, totalQty, router]
  );

  const value: CartContextValue = {
    items,
    open,
    totalQty,
    subtotal,
    add,
    remove,
    setQty,
    openDrawer,
    closeDrawer,
    pickUpsell,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
