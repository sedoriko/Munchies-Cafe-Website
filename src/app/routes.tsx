import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import OwnerLayout from "./layouts/OwnerLayout";
import StaffLayout from "./layouts/StaffLayout";
import AnalyticsDashboard from "./pages/owner/AnalyticsDashboard";
import OrdersPage from "./pages/owner/OrdersPage";
import InventoryPage from "./pages/owner/InventoryPage";
import EmployeesPage from "./pages/owner/EmployeesPage";
import StaffPOS from "./pages/staff/StaffPOS";
import TimeClock from "./pages/staff/TimeClock";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/owner",
    Component: OwnerLayout,
    children: [
      { index: true, Component: AnalyticsDashboard },
      { path: "orders", Component: OrdersPage },
      { path: "inventory", Component: InventoryPage },
      { path: "employees", Component: EmployeesPage },
    ],
  },
  {
    path: "/staff",
    Component: StaffLayout,
    children: [
      { index: true, Component: StaffPOS },
      { path: "timeclock", Component: TimeClock },
    ],
  },
]);
