import { useEffect, useState } from 'react';
import { orderService, DbOrder } from '../../services/orderService';
import { Receipt, Clock, Loader2, Calendar, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

interface GroupedOrders {
  [weekKey: string]: {
    weekStart: Date;
    weekEnd: Date;
    days: {
      [dayKey: string]: {
        date: Date;
        orders: DbOrder[];
      };
    };
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const groupOrders = (orders: DbOrder[]): GroupedOrders => {
    const grouped: GroupedOrders = {};

    orders.forEach(order => {
      const d = new Date(order.created_at || '');
      
      // Calculate Monday of the week
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(new Date(d).setDate(diff));
      monday.setHours(0, 0, 0, 0);
      
      const weekKey = monday.toISOString().split('T')[0];
      const dayKey = d.toISOString().split('T')[0];

      if (!grouped[weekKey]) {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        grouped[weekKey] = {
          weekStart: monday,
          weekEnd: sunday,
          days: {}
        };
      }

      if (!grouped[weekKey].days[dayKey]) {
        grouped[weekKey].days[dayKey] = {
          date: new Date(dayKey),
          orders: []
        };
      }

      grouped[weekKey].days[dayKey].orders.push(order);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  const grouped = groupOrders(orders);
  const weekKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">View organized order receipts by week and day</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl">No orders found</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {weekKeys.map((weekKey) => {
            const week = grouped[weekKey];
            const dayKeys = Object.keys(week.days).sort((a, b) => b.localeCompare(a));
            const totalWeeklyOrders = dayKeys.reduce((sum, dk) => sum + week.days[dk].orders.length, 0);
            const totalWeeklySales = dayKeys.reduce((sum, dk) => 
              sum + week.days[dk].orders.reduce((s, o) => s + Number(o.total), 0), 0
            );

            return (
              <AccordionItem key={weekKey} value={weekKey} className="bg-white border border-gray-200 rounded-xl px-6 overflow-hidden shadow-sm">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Week of {week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {totalWeeklyOrders} orders • ₱{totalWeeklySales.toLocaleString()} gross
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-4 pt-2">
                    {dayKeys.map((dayKey) => {
                      const day = week.days[dayKey];
                      const totalDaySales = day.orders.reduce((sum, o) => sum + Number(o.total), 0);

                      return (
                        <div key={dayKey} className="border border-gray-100 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-medium text-gray-800">
                              {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h4>
                            <span className="text-sm font-semibold text-amber-700">
                              {day.orders.length} orders • ₱{totalDaySales.toLocaleString()}
                            </span>
                          </div>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...day.orders].sort((a, b) => (b.order_number || 0) - (a.order_number || 0)).map((order) => (
                              <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-amber-600" />
                                    <span className="font-bold">#{order.order_number}</span>
                                  </div>
                                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                    {order.status}
                                  </span>
                                </div>

                                <div className="space-y-2 mb-3 border-b border-gray-50 pb-3">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx}>
                                      <div className="flex justify-between">
                                        <span className="text-gray-700">
                                          {item.quantity}x {item.name}
                                          {item.size && ` (${item.size})`}
                                        </span>
                                        <span className="font-medium">₱{item.price * item.quantity}</span>
                                      </div>
                                      {item.add_ons && Array.isArray(item.add_ons) && item.add_ons.length > 0 && (
                                        <div className="pl-3 text-[11px] text-gray-500 italic">
                                          {item.add_ons.map((a: any) => `+ ${a.name}`).join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-between items-center font-bold text-gray-900 mb-3">
                                  <span>Total</span>
                                  <span>₱{order.total.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(order.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <span>By {order.staff_name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
