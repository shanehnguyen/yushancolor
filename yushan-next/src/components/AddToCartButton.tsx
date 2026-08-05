"use client";

import { useCart } from "@/lib/cart-context";

type Item = {
  productId: string;
  variantId?: string | null;
  name: string;
  unitPrice: number;
  variantLabel?: string;
  qty?: number;
};

export function AddToCartButton({ item, label, className }: { item: Item; label: string; className?: string }) {
  const cart = useCart();
  return (
    <button type="button" className={className} onClick={() => cart.add(item)}>
      {label}
    </button>
  );
}
