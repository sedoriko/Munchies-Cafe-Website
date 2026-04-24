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
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRole="owner">
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: AnalyticsDashboard },
      { path: "orders", Component: OrdersPage },
      { path: "inventory", Component: InventoryPage },
      { path: "employees", Component: EmployeesPage },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRole="staff">
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: StaffPOS },
      { path: "orders", Component: OrdersPage },
      { path: "timeclock", Component: TimeClock },
    ],
  },
]);
