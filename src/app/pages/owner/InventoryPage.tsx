import { useState, useEffect } from 'react';
import { inventoryService, InventoryItem } from '../../services/inventoryService';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Minus, 
  Search, 
  Filter,
  Loader2,
  MoreVertical,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from 'sonner';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Adjustment States
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');

  // Add Item States
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    stock: '',
    unit: '',
    reorder_level: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast.error('Could not load inventory data');
    } finally {
      setLoading(false);
    }
  }

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  const commonCategories = ['Beverages', 'Food', 'Ingredients', 'Packaging', 'Toppings', 'Other'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter((item) => item.stock <= item.reorder_level);

  const handleStockUpdate = async () => {
    if (!adjustItem || !adjustAmount) return;
    
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newStock = adjustType === 'add' 
      ? adjustItem.stock + amount 
      : Math.max(0, adjustItem.stock - amount);

    try {
      await inventoryService.updateStock(adjustItem.id, newStock, adjustType === 'add');
      toast.success(`${adjustItem.name} updated successfully`);
      setIsAdjusting(false);
      setAdjustItem(null);
      setAdjustAmount('');
      fetchInventory();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.stock || !newItem.unit || !newItem.reorder_level) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await inventoryService.addItem({
        name: newItem.name,
        category: newItem.category,
        stock: parseFloat(newItem.stock),
        unit: newItem.unit,
        reorder_level: parseFloat(newItem.reorder_level)
      });

      toast.success(`${newItem.name} added to inventory`);
      setIsAddingItem(false);
      setNewItem({ name: '', category: '', stock: '', unit: '', reorder_level: '' });
      fetchInventory();
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Could not add item');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels and manage supplies in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white border-gray-200">
            <History className="w-4 h-4 mr-2" />
            Stock History
          </Button>
          
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Arabica Beans" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(val) => setNewItem({...newItem, category: val})}
                    value={newItem.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      placeholder="0.00" 
                      value={newItem.stock}
                      onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input 
                      id="unit" 
                      placeholder="e.g. kg, L, pcs" 
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorder">Reorder Level (Safety Stock)</Label>
                  <Input 
                    id="reorder" 
                    type="number" 
                    placeholder="e.g. 5" 
                    value={newItem.reorder_level}
                    onChange={(e) => setNewItem({...newItem, reorder_level: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAddItem}>
                  Create Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Low Stock Items</p>
          <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {lowStockItems.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Last Sync</p>
          <p className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-1.5">
            <Clock className="w-4 h-4" /> Just now
          </p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-900 mb-1">Critical Low Stock</h2>
              <p className="text-red-700 mb-3 text-sm font-medium">
                Inventory levels for {lowStockItems.length} items have dropped below the safety threshold.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-red-800 bg-white/60 p-2.5 rounded-lg border border-red-100 backdrop-blur-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="font-bold px-2 py-0.5 bg-red-100 rounded text-[10px]">{item.stock} {item.unit} left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search items by name..." 
              className="pl-10 bg-gray-50 border-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Action</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const isLowStock = item.stock <= item.reorder_level;
                const stockPercentage = (item.stock / item.reorder_level) * 100;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-50' : 'bg-amber-50'}`}>
                          <Package className={`w-5 h-5 ${isLowStock ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold">{item.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Reorder @ {item.reorder_level} {item.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <p className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.stock} {item.unit}
                        </p>
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${isLowStock ? 'bg-red-500' : stockPercentage < 150 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full font-bold uppercase">
                          Critically Low
                        </span>
                      ) : stockPercentage < 150 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full font-bold uppercase">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold uppercase">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-green-200 text-green-600 hover:bg-green-50"
                          onClick={() => {
                            setAdjustItem(item);
                            setAdjustType('add');
                            setIsAdjusting(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setAdjustItem(item);
                            setAdjustType('remove');
                            setIsAdjusting(true);
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No inventory items found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Dialog */}
      <Dialog open={isAdjusting} onOpenChange={setIsAdjusting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {adjustType === 'add' ? (
                <><ArrowUpCircle className="text-green-600 w-6 h-6" /> Restock Item</>
              ) : (
                <><ArrowDownCircle className="text-red-600 w-6 h-6" /> Record Waste / Spoilage</>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current Item</p>
              <p className="text-lg font-bold text-gray-900">{adjustItem?.name}</p>
              <p className="text-sm text-gray-600">Current Stock: <span className="font-bold">{adjustItem?.stock} {adjustItem?.unit}</span></p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                {adjustType === 'add' ? 'Amount to Add' : 'Amount to Deduct'} ({adjustItem?.unit})
              </label>
              <Input 
                type="number" 
                placeholder="0.00" 
                autoFocus
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStockUpdate()}
              />
              <p className="text-[10px] text-gray-400 font-medium">
                {adjustType === 'add' 
                  ? 'This will increase the stock and update the last restocked date.' 
                  : 'Use this for spills, expiration, or other inventory shrinkage.'}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAdjusting(false)} className="flex-1 sm:flex-none">Cancel</Button>
            <Button 
              className={`flex-1 sm:flex-none ${adjustType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={handleStockUpdate}
            >
              Confirm {adjustType === 'add' ? 'Restock' : 'Adjustment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
