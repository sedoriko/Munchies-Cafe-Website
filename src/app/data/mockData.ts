export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
  staffName: string;
}

export interface OrderItem {
  name: string;
  variant?: string;
  size?: string;
  quantity: number;
  price: number;
  addOns?: { name: string; price: number }[];
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  hourlyRate: number;
  avatar?: string;
  status: 'active' | 'inactive';
  clockedIn: boolean;
  lastClockIn?: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  lastRestocked: Date;
}

export interface SalesData {
  date: string;
  gross: number;
  netSales: number;
  orders: number;
}

// Mock employees
export const employees: Employee[] = [
  {
    id: 'e1',
    name: 'Cedrick Dela Corta',
    position: 'Barista',
    email: 'ced.corta@munchies.com',
    phone: '+63 917 123 4567',
    hourlyRate: 85,
    status: 'active',
    clockedIn: true,
    lastClockIn: new Date('2026-04-13T08:00:00'),
  },
  {
    id: 'e2',
    name: 'Andrew Alcantara',
    position: 'Cashier',
    email: 'andrew.alcantara@munchies.com',
    phone: '+63 917 234 5678',
    hourlyRate: 80,
    status: 'active',
    clockedIn: true,
    lastClockIn: new Date('2026-04-13T08:15:00'),
  },
  {
    id: 'e3',
    name: 'Ricky Montoya',
    position: 'Kitchen Staff',
    email: 'ricky.montoya@munchies.com',
    phone: '+63 917 345 6789',
    hourlyRate: 75,
    status: 'active',
    clockedIn: false,
  },
  {
    id: 'e4',
    name: 'Arkin Jaromamay',
    position: 'Barista',
    email: 'arkin.jaromamay@munchies.com',
    phone: '+63 917 456 7890',
    hourlyRate: 85,
    status: 'active',
    clockedIn: false,
  },
];

// Mock inventory
export const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Coffee Beans', category: 'Beverages', stock: 45, unit: 'kg', reorderLevel: 20, lastRestocked: new Date('2026-04-10') },
  { id: 'i2', name: 'Milk', category: 'Beverages', stock: 15, unit: 'L', reorderLevel: 25, lastRestocked: new Date('2026-04-12') },
  { id: 'i3', name: 'Matcha Powder', category: 'Beverages', stock: 8, unit: 'kg', reorderLevel: 10, lastRestocked: new Date('2026-04-08') },
  { id: 'i4', name: 'Sugar', category: 'Ingredients', stock: 50, unit: 'kg', reorderLevel: 15, lastRestocked: new Date('2026-04-11') },
  { id: 'i5', name: 'Whipped Cream', category: 'Toppings', stock: 12, unit: 'cans', reorderLevel: 20, lastRestocked: new Date('2026-04-13') },
  { id: 'i6', name: 'Oreo Cookies', category: 'Ingredients', stock: 25, unit: 'packs', reorderLevel: 15, lastRestocked: new Date('2026-04-10') },
  { id: 'i7', name: 'Pasta', category: 'Food', stock: 30, unit: 'kg', reorderLevel: 10, lastRestocked: new Date('2026-04-09') },
  { id: 'i8', name: 'Chicken', category: 'Food', stock: 18, unit: 'kg', reorderLevel: 15, lastRestocked: new Date('2026-04-13') },
  { id: 'i9', name: 'Potatoes', category: 'Food', stock: 40, unit: 'kg', reorderLevel: 20, lastRestocked: new Date('2026-04-11') },
  { id: 'i10', name: 'Waffle Mix', category: 'Food', stock: 22, unit: 'kg', reorderLevel: 12, lastRestocked: new Date('2026-04-12') },
];

// Mock sales data for the last 7 days
export const salesData: SalesData[] = [
  { date: '2026-04-05', gross: 9162, netSales: 25650, orders: 87 },
  { date: '2026-04-06', gross: 7733, netSales: 28080, orders: 95 },
  { date: '2026-04-07', gross: 7278, netSales: 24120, orders: 82 },
  { date: '2026-04-08', gross: 13823, netSales: 31860, orders: 108 },
  { date: '2026-04-09', gross: 9310, netSales: 29790, orders: 101 },
  { date: '2026-04-10', gross: 6785, netSales: 35010, orders: 118 },
  { date: '2026-04-11', gross: 2939, netSales: 38070, orders: 129 },
];

// Mock weekly data for past weeks
export const weeklyData = [
  { weekStart: '2026-02-09', weekEnd: '2026-02-15', gross: 50935 },
  { weekStart: '2026-02-16', weekEnd: '2026-02-22', gross: 52464 },
  { weekStart: '2026-02-23', weekEnd: '2026-03-01', gross: 33218 },
  { weekStart: '2026-03-02', weekEnd: '2026-03-08', gross: 40823 },
  { weekStart: '2026-03-09', weekEnd: '2026-03-15', gross: 24648 },
  { weekStart: '2026-03-16', weekEnd: '2026-03-22', gross: 57172 },
  { weekStart: '2026-03-23', weekEnd: '2026-03-29', gross: 39754 },
  { weekStart: '2026-03-30', weekEnd: '2026-04-05', gross: 64633 },
  { weekStart: '2026-04-06', weekEnd: '2026-04-12', gross: 57030 },
];

// Mock orders
export const orders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: '#001',
    items: [
      { name: 'Spanish Latte', size: 'Iced', quantity: 2, price: 174, addOns: [{ name: 'Espresso Shot', price: 40 }] },
      { name: 'Oreo Frappe', quantity: 1, price: 175 },
    ],
    subtotal: 563,
    total: 563,
    paymentMethod: 'GCash',
    status: 'completed',
    timestamp: new Date('2026-04-13T09:15:00'),
    staffName: 'Andrew Alcantara',
  },
  {
    id: 'ord-002',
    orderNumber: '#002',
    items: [
      { name: 'Garlic Parmesan Chicken Strips', quantity: 1, price: 200, addOns: [{ name: 'Garlic Rice', price: 40 }] },
      { name: 'Iced Americano', quantity: 1, price: 134 },
    ],
    subtotal: 374,
    total: 374,
    paymentMethod: 'Cash',
    status: 'completed',
    timestamp: new Date('2026-04-13T10:30:00'),
    staffName: 'Andrew Alcantara',
  },
  {
    id: 'ord-003',
    orderNumber: '#003',
    items: [
      { name: 'Fries', variant: 'Cheese', size: 'Sharing', quantity: 1, price: 170 },
      { name: 'Matcha Latte', size: 'Iced', quantity: 2, price: 155 },
    ],
    subtotal: 480,
    total: 480,
    paymentMethod: 'Credit Card',
    status: 'completed',
    timestamp: new Date('2026-04-13T11:45:00'),
    staffName: 'Andrew Alcantara',
  },
];

// Top selling products
export const topProducts = [
  { name: 'Spanish Latte', netSales: 48720, orders: 280 },
  { name: 'Oreo Frappe', netSales: 42875, orders: 245 },
  { name: 'Matcha Latte', netSales: 38750, orders: 250 },
  { name: 'Garlic Parmesan Chicken Strips', netSales: 36400, orders: 182 },
  { name: 'Salted Caramel', netSales: 31320, orders: 180 },
];
