import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Trophy, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { analyticsService, DashboardStats } from '../../services/analyticsService';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your cafe's performance and insights with real-time data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Gross</p>
              <p className="text-3xl text-gray-900">₱{stats.dailyGross.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Weekly Gross (Current)</p>
              <p className="text-3xl text-gray-900">₱{stats.weeklyGross.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                View Weekly History
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Weekly Gross Sales History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 max-h-[60vh] overflow-auto pr-2">
                {stats.weeklyGrossHistory.map((week, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(week.weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(week.weekEnd + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-xl font-semibold">₱{week.gross.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">All Time Top Item</p>
              <p className="text-xl text-gray-900 font-medium">{stats.topItemName}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900 font-bold">₱{stats.topItemSales.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.topItemOrders} total orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-6">Gross Sales Trend (7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `₱${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Gross Sales']}
                />
                <Line type="monotone" dataKey="gross" stroke="#d97706" strokeWidth={3} dot={{ fill: '#d97706', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-6">Top Products (Net Sales)</h2>
          <div className="space-y-5">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-sm font-bold text-amber-700">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.orders} orders</p>
                  </div>
                </div>
                <p className="text-lg text-gray-900 font-semibold">₱{product.netSales.toLocaleString()}</p>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-center py-8 text-gray-500 italic">No sales data available yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
