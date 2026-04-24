# ☕ Munchies Cafe POS & Management System

A modern, comprehensive digital solution for cafe operations, built with a focus on speed, aesthetics, and role-based functionality. This application provides a seamless experience for both cafe owners managing their business and staff handling day-to-day sales.

## 🚀 Key Features

### 👨‍💼 Owner Dashboard
- **Real-time Analytics:** Track daily/weekly gross sales, top-selling products, and revenue trends using interactive charts.
- **Inventory Management:** Monitor stock levels with low-stock alerts and unit tracking.
- **Order History:** A complete, searchable archive of all transactions grouped by week and day.
- **Employee Management:** Track staff records, hourly rates, and current clock-in status.

### ☕ Staff Interface (POS)
- **High-Speed POS:** Intuitive cart system with support for complex item variants (Iced/Hot, Solo/Sharing).
- **Customizable Orders:** Support for various add-ons (Espresso shots, syrups, etc.) with automatic price calculation.
- **Time Clock:** Simple PIN-based login and digital time clock for staff attendance.
- **Order Tracking:** Real-time status updates for active orders.

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State & Routing:** [React Router 7](https://reactrouter.com/)
- **Database/Auth:** [Supabase](https://supabase.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd munchies-cafe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/  # Reusable UI primitives (Radix/Shadcn)
│   ├── contexts/    # Global state (Auth, etc.)
│   ├── data/        # Menu definitions and static data
│   ├── layouts/     # Role-specific dashboard wrappers
│   ├── pages/       # Owner and Staff specific views
│   └── services/    # Supabase API logic (Orders, Analytics)
├── lib/             # Third-party client initializations
└── styles/          # Global theme and Tailwind configuration
```

## 📝 License

This project was built for Munchies Cafe operations. All rights reserved.
