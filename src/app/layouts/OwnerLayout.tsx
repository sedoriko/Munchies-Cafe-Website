import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { BarChart3, Package, Users, Receipt, LogOut, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";

export default function OwnerLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/owner', icon: BarChart3, label: 'Analytics Dashboard' },
    { path: '/owner/orders', icon: Receipt, label: 'Orders' },
    { path: '/owner/inventory', icon: Package, label: 'Inventory Management' },
    { path: '/owner/employees', icon: Users, label: 'Employees' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-amber-900 text-white">
      <div className="p-6 border-b border-amber-800">
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo_clr.png" alt="Munchies Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold">Munchies Cafe</h1>
            <p className="text-sm text-amber-300 font-medium">Owner Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-amber-800 text-white'
                  : 'text-amber-100 hover:bg-amber-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-amber-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-100 hover:bg-amber-800/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0">
        <NavContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-amber-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src="/logo_clr.png" alt="Munchies Logo" className="w-6 h-6 object-contain" />
            <h1 className="text-lg font-bold">Munchies Cafe</h1>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-amber-800">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none w-64">
              <NavContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
