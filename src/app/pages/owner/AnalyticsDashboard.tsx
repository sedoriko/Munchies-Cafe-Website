import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { salesData, topProducts, weeklyData } from '../../data/mockData';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export default function AnalyticsDashboard() {
  const todayGross = salesData[salesData.length - 1].gross;
  const currentWeekGross = weeklyData[weeklyData.length - 1].gross;
  const allTimeTopItem = topProducts[0];

  const chartData = salesData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    gross: d.gross,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your cafe's performance and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Gross</p>
              <p className="text-3xl text-gray-900">₱{todayGross.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Weekly Gross</p>
              <p className="text-3xl text-gray-900">₱{currentWeekGross.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                View Weekly Gross
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Weekly Gross Sales</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {weeklyData.map((week, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(week.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-xl">₱{week.gross.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">All Time Top Item</p>
              <p className="text-xl text-gray-900">{allTimeTopItem.name}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">₱{allTimeTopItem.netSales.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">{allTimeTopItem.orders} orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl text-gray-900 mb-6">Gross Sales Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Gross Sales']}
              />
              <Line type="monotone" dataKey="gross" stroke="#d97706" strokeWidth={3} dot={{ fill: '#d97706', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl text-gray-900 mb-6">Top Products (Net Sales)</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm text-amber-900">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.orders} orders</p>
                  </div>
                </div>
                <p className="text-lg text-gray-900">₱{product.netSales.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
