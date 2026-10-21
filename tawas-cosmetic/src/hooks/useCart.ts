// src/hooks/useCart.ts
'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tawas_cart_v1';

export type CartItem = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  imageUrl: string;
  unitPriceKes: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  subtotalKes: number;
  isHydrated: boolean;
};

export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotalKes: 0,
    isHydrated: false,
  });

  // Hydrate from localStorage on mount (client-only, not during SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items: CartItem[] = JSON.parse(raw);
        setState({
          items,
          subtotalKes: items.reduce((sum, i) => sum + i.unitPriceKes * i.quantity, 0),
          isHydrated: true,
        });
      } else {
        setState((s) => ({ ...s, isHydrated: true }));
      }
    } catch {
      setState((s) => ({ ...s, isHydrated: true }));
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!state.isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, state.isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    setState((s) => {
      const existing = s.items.find((i) => i.variantId === item.variantId);
      const items = existing
        ? s.items.map((i) =>
            i.variantId === item.variantId ? { ...i, quantity: i.quantity + qty } : i
          )
        : [...s.items, { ...item, quantity: qty }];
      return {
        ...s,
        items,
        subtotalKes: items.reduce((sum, i) => sum + i.unitPriceKes * i.quantity, 0),
      };
    });
  }, []);

  const updateQty = useCallback((variantId: string, qty: number) => {
    if (qty < 1) return;
    setState((s) => {
      const items = s.items.map((i) =>
        i.variantId === variantId ? { ...i, quantity: qty } : i
      );
      return {
        ...s,
        items,
        subtotalKes: items.reduce((sum, i) => sum + i.unitPriceKes * i.quantity, 0),
      };
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setState((s) => {
      const items = s.items.filter((i) => i.variantId !== variantId);
      return {
        ...s,
        items,
        subtotalKes: items.reduce((sum, i) => sum + i.unitPriceKes * i.quantity, 0),
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState({ items: [], subtotalKes: 0, isHydrated: true });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { ...state, addItem, updateQty, removeItem, clear };
}