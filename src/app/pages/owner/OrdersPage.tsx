import { useEffect, useState } from 'react';
import { orderService, DbOrder } from '../../services/orderService';
import { Receipt, Clock, Loader2, Calendar, ChevronRight, Printer, Download, FileText, ChevronLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';

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
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportStep, setExportStep] = useState<'type' | 'selection'>('type');
  const [exportType, setExportType] = useState<'weekly' | 'monthly' | 'products'>('weekly');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

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

  // Get unique months from orders
  const availableMonths = Array.from(new Set(orders.map(o => {
    const d = new Date(o.created_at || '');
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))).sort().reverse();

  // Get unique weeks from orders
  const availableWeeks = Array.from(new Set(orders.map(o => {
    const d = new Date(o.created_at || '');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date(d).setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  }))).sort().reverse();

  const handlePrint = (order: DbOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items?.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${item.quantity}x ${item.name} ${item.size ? `(${item.size})` : ''}</span>
        <span>₱${(item.price * item.quantity).toLocaleString()}</span>
      </div>
      ${item.add_ons && Array.isArray(item.add_ons) && item.add_ons.length > 0 ? `
        <div style="padding-left: 12px; font-size: 10px; font-style: italic; color: #666; margin-bottom: 4px;">
          ${item.add_ons.map((a: any) => `+ ${a.name}`).join(', ')}
        </div>
      ` : ''}
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${order.order_number}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #333; line-height: 1.4; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px; }
            .order-info { font-size: 12px; margin-bottom: 10px; }
            .items { border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px; font-size: 12px; }
            .total { font-weight: bold; display: flex; justify-content: space-between; font-size: 14px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
            @media print { body { padding: 0; width: 80mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">MUNCHIES CAFE</h2>
            <p style="margin: 4px 0; font-size: 10px;">Official Receipt</p>
          </div>
          <div class="order-info">
            <div>Order: #${order.order_number}</div>
            <div>Date: ${new Date(order.created_at || '').toLocaleString()}</div>
            <div>Staff: ${order.staff_name}</div>
            <div>Status: ${order.status}</div>
            <div>Payment: ${order.payment_method}</div>
          </div>
          <div class="items">
            ${itemsHtml}
          </div>
          <div class="total">
            <span>TOTAL</span>
            <span>₱${order.total.toLocaleString()}</span>
          </div>
          <div class="footer">
            <p>Thank you for choosing Munchies Cafe!</p>
            <p>Please come again.</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToExcel = (data: any[], fileName: string, sheetName: string, colWidths: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths to prevent ####
    ws['!cols'] = colWidths;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    setIsExportDialogOpen(false);
    setExportStep('type');
  };

  const handleExport = () => {
    if (exportType === 'weekly') {
      if (!selectedWeek) return;
      
      const weekStart = new Date(selectedWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const filteredOrders = orders.filter(o => {
        const d = new Date(o.created_at || '');
        return d >= weekStart && d < weekEnd;
      });

      const data = filteredOrders.map(o => ({
        'Order #': o.order_number,
        'Date': new Date(o.created_at || '').toLocaleDateString(),
        'Time': new Date(o.created_at || '').toLocaleTimeString(),
        'Staff': o.staff_name,
        'Payment': o.payment_method,
        'Status': o.status,
        'Total (₱)': Number(o.total)
      }));

      exportToExcel(
        data, 
        `Weekly_Gross_${selectedWeek}`, 
        'Weekly Sales',
        [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
      );
    } 
    else if (exportType === 'monthly') {
      if (!selectedMonth) return;

      const filteredOrders = orders.filter(o => {
        const d = new Date(o.created_at || '');
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return monthKey === selectedMonth;
      });

      const data = filteredOrders.map(o => ({
        'Order #': o.order_number,
        'Date': new Date(o.created_at || '').toLocaleDateString(),
        'Time': new Date(o.created_at || '').toLocaleTimeString(),
        'Staff': o.staff_name,
        'Payment': o.payment_method,
        'Status': o.status,
        'Total (₱)': Number(o.total)
      }));

      exportToExcel(
        data, 
        `Monthly_Gross_${selectedMonth}`, 
        'Monthly Sales',
        [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
      );
    }
    else if (exportType === 'products') {
      const productMap = new Map<string, { qty: number; sales: number }>();
      orders.forEach(o => {
        o.items?.forEach(item => {
          const key = item.name + (item.size ? ` (${item.size})` : '');
          const existing = productMap.get(key) || { qty: 0, sales: 0 };
          productMap.set(key, {
            qty: existing.qty + item.quantity,
            sales: existing.sales + (item.price * item.quantity)
          });
        });
      });

      const data = Array.from(productMap.entries())
        .sort((a, b) => b[1].qty - a[1].qty)
        .map(([name, stats]) => ({
          'Product Name': name,
          'Units Sold': stats.qty,
          'Total Revenue (₱)': stats.sales
        }));

      exportToExcel(
        data, 
        'Products_Sold_All_Time', 
        'Inventory Sales',
        [{ wch: 40 }, { wch: 15 }, { wch: 20 }]
      );
    }
  };

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">View organized order receipts by week and day</p>
        </div>
        
        {isOwner && (
          <Dialog 
            open={isExportDialogOpen} 
            onOpenChange={(val) => {
              setIsExportDialogOpen(val);
              if (!val) setExportStep('type');
            }}
          >
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {exportStep === 'selection' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExportStep('type')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  )}
                  <DialogTitle>
                    {exportStep === 'type' ? 'Export Order Data' : `Select ${exportType === 'weekly' ? 'Week' : 'Month'}`}
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                {exportStep === 'type' ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-12" 
                      onClick={() => {
                        setExportType('weekly');
                        setExportStep('selection');
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-3 text-green-600" />
                      Weekly Gross Sales
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12" 
                      onClick={() => {
                        setExportType('monthly');
                        setExportStep('selection');
                      }}
                    >
                      <FileText className="w-4 h-4 mr-3 text-purple-600" />
                      Monthly Gross Sales
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12" 
                      onClick={() => {
                        setExportType('products');
                        handleExport(); // Product export doesn't need selection step in this version
                      }}
                    >
                      <Receipt className="w-4 h-4 mr-3 text-amber-600" />
                      Products Sold (All Time)
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-[300px] overflow-auto border rounded-lg p-1">
                      {exportType === 'weekly' ? (
                        availableWeeks.map(week => {
                          const d = new Date(week);
                          const end = new Date(d);
                          end.setDate(d.getDate() + 6);
                          return (
                            <button
                              key={week}
                              onClick={() => setSelectedWeek(week)}
                              className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-colors ${
                                selectedWeek === week ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-50'
                              }`}
                            >
                              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </button>
                          );
                        })
                      ) : (
                        availableMonths.map(month => {
                          const [year, m] = month.split('-');
                          const d = new Date(parseInt(year), parseInt(m) - 1);
                          return (
                            <button
                              key={month}
                              onClick={() => setSelectedMonth(month)}
                              className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-colors ${
                                selectedMonth === month ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-50'
                              }`}
                            >
                              {d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </button>
                          );
                        })
                      )}
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={(exportType === 'weekly' && !selectedWeek) || (exportType === 'monthly' && !selectedMonth)}
                      onClick={handleExport}
                    >
                      Download Excel Report
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
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
                                        <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
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

                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(order.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <span>By {order.staff_name}</span>
                                </div>

                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full text-xs h-8 border-amber-200 text-amber-800 hover:bg-amber-50"
                                  onClick={() => handlePrint(order)}
                                >
                                  <Printer className="w-3.5 h-3.5 mr-2" />
                                  Print Receipt
                                </Button>
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
