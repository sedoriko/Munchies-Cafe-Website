import { supabase } from '../../lib/supabase';

export interface DashboardStats {
  dailyGross: number;
  weeklyGross: number;
  topItemName: string;
  topItemSales: number;
  topItemOrders: number;
  salesTrend: { date: string; gross: number }[];
  topProducts: { name: string; orders: number; netSales: number }[];
  weeklyGrossHistory: { weekStart: string; weekEnd: string; gross: number }[];
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (!supabase) throw new Error('Supabase not initialized');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    // 1. Get Daily Gross
    const { data: dailyData } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', today);
    
    const dailyGross = dailyData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    // 2. Get Weekly Gross (Current Calendar Week: Monday - Sunday)
    const dWeek = new Date(now);
    const dayNum = dWeek.getDay();
    const diffToMon = dWeek.getDate() - dayNum + (dayNum === 0 ? -6 : 1);
    const currentMonday = new Date(dWeek.setDate(diffToMon));
    currentMonday.setHours(0, 0, 0, 0);
    
    const { data: weeklyData } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', currentMonday.toISOString());
    
    const weeklyGross = weeklyData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    // 3. Get Sales Trend (Last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: trendData } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: true });

    const trendMap = new Map();
    trendData?.forEach(o => {
      const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap.set(date, (trendMap.get(date) || 0) + Number(o.total));
    });
    const salesTrend = Array.from(trendMap.entries()).map(([date, gross]) => ({ date, gross }));

    // 4. Get Top Products
    const { data: itemsData } = await supabase
      .from('order_items')
      .select('name, price, quantity');

    const productMap = new Map();
    itemsData?.forEach(item => {
      const stats = productMap.get(item.name) || { orders: 0, netSales: 0 };
      stats.orders += item.quantity;
      stats.netSales += Number(item.price) * item.quantity;
      productMap.set(item.name, stats);
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.netSales - a.netSales);

    // 5. Weekly History (Grouped by Week)
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total, created_at')
      .order('created_at', { ascending: false });

    const weeklyMap = new Map();
    allOrders?.forEach(o => {
      const d = new Date(o.created_at);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const monday = new Date(d.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      // Use local date string YYYY-MM-DD instead of toISOString to avoid timezone shifts
      const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
      const endKey = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
      
      const weekStats = weeklyMap.get(key) || { 
        weekStart: key, 
        weekEnd: endKey, 
        gross: 0 
      };
      weekStats.gross += Number(o.total);
      weeklyMap.set(key, weekStats);
    });

    const weeklyGrossHistory = Array.from(weeklyMap.values());

    return {
      dailyGross,
      weeklyGross,
      topItemName: topProducts[0]?.name || 'N/A',
      topItemSales: topProducts[0]?.netSales || 0,
      topItemOrders: topProducts[0]?.orders || 0,
      salesTrend,
      topProducts: topProducts.slice(0, 5),
      weeklyGrossHistory
    };
  }
};
