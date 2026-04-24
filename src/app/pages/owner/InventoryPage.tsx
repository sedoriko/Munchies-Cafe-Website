import { inventory } from '../../data/mockData';
import { Package, AlertTriangle, TrendingDown, Calendar } from 'lucide-react';

export default function InventoryPage() {
  const lowStockItems = inventory.filter((item) => item.stock <= item.reorderLevel);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">Inventory Management</h1>
        <p className="text-gray-600">Track stock levels and manage inventory</p>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-900 mb-1">Low Stock Alert</h2>
              <p className="text-red-700 mb-3 text-sm md:text-base font-medium">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low on stock
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs md:text-sm text-red-800 bg-white/50 p-2 rounded-lg border border-red-100">
                    <TrendingDown className="w-4 h-4 shrink-0" />
                    <span>
                      {item.name}: <span className="font-bold">{item.stock} {item.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Reorder Level</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Last Restocked</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => {
                const isLowStock = item.stock <= item.reorderLevel;
                const stockPercentage = (item.stock / item.reorderLevel) * 100;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-gray-900 font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.lastRestocked.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Low Stock
                        </span>
                      ) : stockPercentage < 200 ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                          Moderate
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Cards */}
      <div className="md:hidden space-y-4">
        {inventory.map((item) => {
          const isLowStock = item.stock <= item.reorderLevel;
          const stockPercentage = (item.stock / item.reorderLevel) * 100;

          return (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-gray-900 font-bold">{item.name}</h3>
                </div>
                {isLowStock ? (
                  <span className="p-1.5 bg-red-100 text-red-700 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${stockPercentage < 200 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Stock</p>
                  <p className="text-sm font-bold text-gray-900">{item.stock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Reorder At</p>
                  <p className="text-sm font-medium text-gray-600">{item.reorderLevel} {item.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.lastRestocked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium capitalize">{item.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
