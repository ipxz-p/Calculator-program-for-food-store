"use client";

import { createContext, useContext, useMemo } from "react";
import type { MenuContextValue } from "../types";
import { MenuItem } from "../types";

interface MenuProviderProps {
  items: MenuItem[];
  children: React.ReactNode;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ items, children }: MenuProviderProps) {
  const value = useMemo<MenuContextValue>(() => {
    const itemsMap = new Map(items.map((item) => [item.id, item]));
    return { items, itemsMap };
  }, [items]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
