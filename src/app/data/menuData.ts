export interface MenuItem {
  id: string;
  name: string;
  category: string;
  prices: {
    iced?: number;
    hot?: number;
    solo?: number;
    sharing?: number;
    default?: number;
  };
  variants?: string[];
}

export interface MenuAddOn {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const menuItems: MenuItem[] = [
  // Coffee Based
  { id: 'c1', name: 'Americano', category: 'Coffee Based', prices: { iced: 134, hot: 124 } },
  { id: 'c2', name: 'Mocha', category: 'Coffee Based', prices: { iced: 144, hot: 134 } },
  { id: 'c3', name: 'Cappuccino', category: 'Coffee Based', prices: { iced: 144, hot: 134 } },
  { id: 'c4', name: 'Dirty Matcha', category: 'Coffee Based', prices: { iced: 164, hot: 154 } },
  { id: 'c5', name: 'Spanish Latte', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c6', name: 'Sea Salt Latte', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c7', name: 'Salted Caramel', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c8', name: 'Munchies Latte', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c9', name: 'Caramel Macchiato', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c10', name: 'White Chocolate Mocha', category: 'Coffee Based', prices: { iced: 174, hot: 164 } },
  { id: 'c11', name: 'Cafe Latte', category: 'Coffee Based', prices: { iced: 144, hot: 134 } },

  // Frappe
  { id: 'f1', name: 'Oreo', category: 'Frappe', prices: { default: 175 } },
  { id: 'f2', name: 'Oreo Matcha', category: 'Frappe', prices: { default: 185 } },
  { id: 'f3', name: 'Mocha', category: 'Frappe', prices: { default: 175 } },
  { id: 'f4', name: 'Double Choco', category: 'Frappe', prices: { default: 175 } },
  { id: 'f5', name: 'JavaChip', category: 'Frappe', prices: { default: 175 } },
  { id: 'f6', name: 'Matcha Cream', category: 'Frappe', prices: { default: 175 } },
  { id: 'f7', name: 'Strawberry Cream', category: 'Frappe', prices: { default: 175 } },
  { id: 'f8', name: 'Strawberry Matcha', category: 'Frappe', prices: { default: 185 } },
  { id: 'f9', name: 'White Chocolate Mocha', category: 'Frappe', prices: { default: 185 } },
  { id: 'f10', name: 'Choco-Caramel Brownies', category: 'Frappe', prices: { default: 185 } },

  // Matcha Series
  { id: 'm1', name: 'Matcha Latte', category: 'Matcha Series', prices: { iced: 155, hot: 145 } },
  { id: 'm2', name: 'Strawberry Matcha', category: 'Matcha Series', prices: { default: 170 } },
  { id: 'm3', name: 'Blueberry Matcha', category: 'Matcha Series', prices: { default: 170 } },
  { id: 'm4', name: 'Salted Caramel Matcha', category: 'Matcha Series', prices: { default: 170 } },
  { id: 'm5', name: 'Blueberry Creamcheese', category: 'Matcha Series', prices: { default: 200 } },
  { id: 'm6', name: 'Matcha Mousse', category: 'Matcha Series', prices: { default: 200 } },

  // Fries
  { id: 'fr1', name: 'Fries', category: 'Fries', prices: { solo: 95, sharing: 170 }, variants: ['BBQ', 'Sour Cream', 'Cheese'] },

  // Pasta
  { id: 'p1', name: 'Cheesy Macaroni', category: 'Pasta', prices: { default: 170 } },
  { id: 'p2', name: 'Chicken Alfredo', category: 'Pasta', prices: { default: 200 } },

  // Waffles
  { id: 'w1', name: 'Classic Waffle', category: 'Waffles', prices: { default: 100 } },
  { id: 'w2', name: 'Blueberry Creamcheese Waffle', category: 'Waffles', prices: { default: 120 } },
  { id: 'w3', name: 'Cookies and Cream Waffle', category: 'Waffles', prices: { default: 120 } },
  { id: 'w4', name: 'Mango Graham Waffle', category: 'Waffles', prices: { default: 120 } },

  // Rice Meals
  { id: 'r1', name: 'Garlic Parmesan Chicken Strips', category: 'Rice Meals', prices: { default: 200 } },
  { id: 'r2', name: 'Spicy Buffalo Chicken Strips', category: 'Rice Meals', prices: { default: 200 } },
  { id: 'r3', name: 'Salted Egg Chicken Strips', category: 'Rice Meals', prices: { default: 200 } },
  { id: 'r4', name: 'Hungarian Silog', category: 'Rice Meals', prices: { default: 180 } },
  { id: 'r5', name: 'Cornsilog', category: 'Rice Meals', prices: { default: 180 } },
  { id: 'r6', name: 'Spamsilog', category: 'Rice Meals', prices: { default: 180 } },
  { id: 'r7', name: 'Porkchop w/ Gravy', category: 'Rice Meals', prices: { default: 219 } },
];

export const addOns: MenuAddOn[] = [
  // Drinks Add-ons
  { id: 'a1', name: 'Sauce/Syrup', price: 30, category: 'Drinks' },
  { id: 'a2', name: 'Whipped Cream', price: 35, category: 'Drinks' },
  { id: 'a3', name: 'Espresso Shot', price: 40, category: 'Drinks' },
  { id: 'a4', name: 'Sea Salt Foam', price: 40, category: 'Drinks' },
  { id: 'a5', name: 'Sub Oat', price: 40, category: 'Drinks' },

  // Rice Meal Add-ons
  { id: 'a6', name: 'Bottled Water', price: 30, category: 'Rice Meals' },
  { id: 'a7', name: 'Plain Rice', price: 35, category: 'Rice Meals' },
  { id: 'a8', name: 'Garlic Rice', price: 40, category: 'Rice Meals' },
  { id: 'a9', name: 'Ketchup', price: 40, category: 'Rice Meals' },
  { id: 'a10', name: 'Garlic Ranch Dip', price: 40, category: 'Rice Meals' },
];

export const categories = [
  'Coffee Based',
  'Frappe',
  'Matcha Series',
  'Fries',
  'Pasta',
  'Waffles',
  'Rice Meals',
];
