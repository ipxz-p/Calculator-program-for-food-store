export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  hasDoubleOrderDiscount: boolean;
}

export interface MenuCardProps {
  item: MenuItem;
}

export interface MenuContextValue {
  items: MenuItem[];
  itemsMap: Map<string, MenuItem>;
}

export interface MenuProviderProps {
  items: MenuItem[];
  children: React.ReactNode;
}
