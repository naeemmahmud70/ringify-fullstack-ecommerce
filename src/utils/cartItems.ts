import { CartItemT } from "@/components/Cart/CartItems";

export const splitCartItems = (cartItems: CartItemT[]) => {
  const expanded = expandCartItems(cartItems);

  // If less than 6 items → all are selected, none free
  if (expanded.length < 6) {
    return {
      paid: groupSelected(expanded),
      free: [],
    };
  }

  // Otherwise calculate free
  const freeCount = Math.floor((expanded.length + 1) / 6);
  const selectedCount = expanded.length - freeCount;

  const selectedExpanded = expanded.slice(0, selectedCount);
  const free = expanded.slice(selectedCount);

  return {
    paid: groupSelected(selectedExpanded),
    free,
  };
};

// group by color + size
const groupSelected = (items: CartItemT[]) => {
  const grouped: CartItemT[] = [];

  items.forEach(item => {
    const existing = grouped.find(
      g => g.size === item.size && g.color === item.color
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      grouped.push({ ...item, quantity: 1 });
    }
  });

  return grouped;
};

const expandCartItems = (cartItems: CartItemT[]): CartItemT[] => {
  return cartItems.flatMap(item =>
    Array.from({ length: item.quantity }, () => ({
      ...item,
      quantity: 1,
    }))
  );
};

export const formatColor = (color: string) => {
  const colorMap: Record<string, string> = {
    black: "Black",
    silver: "Silver",
    rosegold: "Rose Gold",
  };
  return colorMap[color.toLowerCase()] || color;
};
