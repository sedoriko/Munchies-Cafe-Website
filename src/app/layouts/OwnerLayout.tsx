import { Outlet, Link, useLocation } from 'react-router';
import { BarChart3, Package, Users, Receipt, Coffee, LogOut } from 'lucide-react';

export default function OwnerLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/owner', icon: BarChart3, label: 'Analytics Dashboard' },
    { path: '/owner/orders', icon: Receipt, label: 'Orders' },
    { path: '/owner/inventory', icon: Package, label: 'Inventory Management' },
    { path: '/owner/employees', icon: Users, label: 'Employees' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-amber-900 text-white flex flex-col">
        <div className="p-6 border-b border-amber-800">
          <div className="flex items-center gap-3 mb-2">
            <Coffee className="w-8 h-8" />
            <div>
              <h1 className="text-xl">Munchies Cafe</h1>
              <p className="text-sm text-amber-300">Owner Dashboard</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-amber-800 text-white'
                    : 'text-amber-100 hover:bg-amber-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
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
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
