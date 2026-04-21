import { orders } from '../../data/mockData';
import { Receipt, Clock } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">View all order receipts and transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <span className="text-lg">{order.orderNumber}</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {order.status}
              </span>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-900">
                      {item.quantity}x {item.name}
                      {item.size && ` (${item.size})`}
                      {item.variant && ` - ${item.variant}`}
                    </span>
                    <span className="text-gray-900">₱{item.price * item.quantity}</span>
                  </div>
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {item.addOns.map((addon, addonIdx) => (
                        <div key={addonIdx} className="flex justify-between text-sm text-gray-600">
                          <span>+ {addon.name}</span>
                          <span>₱{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₱{order.total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{order.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span>By {order.staffName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
