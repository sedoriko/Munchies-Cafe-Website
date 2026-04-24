import { supabase } from '../../lib/supabase';

export interface DbOrderItem {
  id?: string;
  order_id?: string;
  name: string;
  variant?: string;
  size?: string;
  quantity: number;
  price: number;
  add_ons?: any; // JSONB
}

export interface DbOrder {
  id?: string;
  order_number?: number;
  subtotal: number;
  total: number;
  payment_method: string;
  status: string;
  created_at?: string;
  staff_name: string;
  items?: DbOrderItem[];
}

export const orderService = {
  async createOrder(order: Omit<DbOrder, 'id' | 'created_at'>, items: Omit<DbOrderItem, 'id' | 'order_id'>[]) {
    if (!supabase) throw new Error('Supabase client not initialized');

    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert items with order_id
    const itemsToInsert = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return orderData;
  },

  async getAllOrders(): Promise<DbOrder[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }
};
