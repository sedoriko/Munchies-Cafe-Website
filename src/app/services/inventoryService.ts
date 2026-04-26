import { supabase } from '../../lib/supabase';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorder_level: number;
  last_restocked: string;
}

export const inventoryService = {
  async getInventory(): Promise<InventoryItem[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }

    return data || [];
  },

  async updateStock(id: string, newStock: number, isRestock: boolean = false) {
    if (!supabase) throw new Error('Supabase not initialized');

    const updateData: any = { stock: newStock };
    if (isRestock) {
      updateData.last_restocked = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteItem(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
  },

  async addItem(item: Omit<InventoryItem, 'id' | 'last_restocked'>) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
