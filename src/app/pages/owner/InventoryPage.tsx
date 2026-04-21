import { inventory } from '../../data/mockData';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';

export default function InventoryPage() {
  const lowStockItems = inventory.filter((item) => item.stock <= item.reorderLevel);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Track stock levels and manage inventory</p>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg text-red-900 mb-2">Low Stock Alert</h2>
              <p className="text-red-700 mb-3">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low on stock
              </p>
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-red-800">
                    <TrendingDown className="w-4 h-4" />
                    <span>
                      {item.name}: {item.stock} {item.unit} (Reorder at {item.reorderLevel} {item.unit})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Item Name</th>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Reorder Level</th>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Last Restocked</th>
                <th className="px-6 py-4 text-left text-sm text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => {
                const isLowStock = item.stock <= item.reorderLevel;
                const stockPercentage = (item.stock / item.reorderLevel) * 100;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-900">
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
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                          <AlertTriangle className="w-4 h-4" />
                          Low Stock
                        </span>
                      ) : stockPercentage < 200 ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                          Moderate
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
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
    </div>
  );
}
