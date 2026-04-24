import { useState, useEffect } from 'react';
import { menuItems, categories, addOns, MenuItem } from '../../data/menuData';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, User, Menu } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { toast } from 'sonner';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../hooks/useEmployees';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  size?: string;
  addOns: { name: string; price: number }[];
}

export default function StaffPOS() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const [selectedCategory, setSelectedCategory] = useState('Coffee Based');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<'iced' | 'hot' | 'solo' | 'sharing' | 'default'>('default');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);

  // Track which clocked-in staff is taking orders
  const clockedInEmployees = employees.filter(emp => emp.clockedIn);
  const [activeStaffId, setActiveStaffId] = useState<string>('');

  // Sync active staff if the list changes and current selection is no longer clocked in
  useEffect(() => {
    if (!activeStaffId && clockedInEmployees.length > 0) {
      const isUserClockedIn = clockedInEmployees.find(emp => emp.id === user?.id);
      setActiveStaffId(isUserClockedIn ? (user?.id || '') : clockedInEmployees[0].id);
    } else if (activeStaffId && !clockedInEmployees.find(emp => emp.id === activeStaffId)) {
      setActiveStaffId(clockedInEmployees[0]?.id || '');
    }
  }, [employees, activeStaffId, clockedInEmployees, user?.id]);

  const activeStaff = employees.find(emp => emp.id === activeStaffId) || user;

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = () => {
    if (!selectedItem) return;

    const price = selectedItem.prices[selectedSize] || selectedItem.prices.default || 0;
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = price + addOnsTotal;

    const newItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      price: totalPrice,
      quantity: 1,
      size: selectedSize !== 'default' ? selectedSize : undefined,
      variant: selectedVariant || undefined,
      addOns: selectedAddOns,
    };

    setCart([...cart, newItem]);
    setSelectedItem(null);
    setSelectedSize('default');
    setSelectedVariant('');
    setSelectedAddOns([]);
    setItemDialogOpen(false);
    toast.success('Item added to cart', { duration: 1500 });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getItemPrice = (item: MenuItem | null, size: string) => {
    if (!item) return 0;
    if (size === 'iced' && item.prices.iced) return item.prices.iced;
    if (size === 'hot' && item.prices.hot) return item.prices.hot;
    if (size === 'solo' && item.prices.solo) return item.prices.solo;
    if (size === 'sharing' && item.prices.sharing) return item.prices.sharing;
    return item.prices.default || 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setPaymentDialogOpen(true);
  };

  const completeOrder = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      const dbOrder = {
        subtotal: subtotal,
        total: total,
        payment_method: selectedPayment,
        status: 'completed',
        staff_name: activeStaff?.name || 'Unknown Staff'
      };

      const dbItems = cart.map(item => ({
        name: item.name,
        variant: item.variant,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        add_ons: item.addOns
      }));

      await orderService.createOrder(dbOrder, dbItems);

      toast.success(`Order completed! Payment: ${selectedPayment}`);
      setCart([]);
      setPaymentDialogOpen(false);
      setSelectedPayment('');
      setCartOpen(false);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to save order: ' + error.message);
    }
  };

  const CartContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Current Order</h2>
          </div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-2">
          <div className="flex items-center gap-2 text-amber-900 mb-2 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Active Server</span>
          </div>
          {clockedInEmployees.length > 0 ? (
            <select
              value={activeStaffId}
              onChange={(e) => setActiveStaffId(e.target.value)}
              className="w-full bg-white border border-amber-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {clockedInEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-amber-700 italic">No one clocked in. Using: {user?.name}</p>
          )}
        </div>
        <p className="text-sm text-gray-600 font-medium">{cart.length} items</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-gray-900 font-bold">
                      {item.name}
                      {item.size && ` (${item.size})`}
                      {item.variant && ` - ${item.variant}`}
                    </h3>
                    {item.addOns.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {item.addOns.map((addon, idx) => (
                          <p key={idx} className="text-xs text-gray-500">
                            + {addon.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-gray-900 w-6 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-900 font-bold">₱{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 space-y-4 bg-white">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Subtotal</span>
            <span>₱{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-amber-700">₱{total.toLocaleString()}</span>
          </div>
        </div>

        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-bold shadow-lg shadow-amber-600/20"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Checkout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[50vh] overflow-auto pr-2">
              {['Cash', 'Credit/Debit Card', 'GCash', 'PayMaya'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPayment === method
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                      : 'border-gray-100 hover:border-amber-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-900">{method}</div>
                  <div className="text-xs text-gray-500">Pay with {method.toLowerCase()}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-amber-700">₱{total.toLocaleString()}</span>
              </div>
              <Button
                onClick={completeOrder}
                disabled={!selectedPayment}
                className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg font-bold"
              >
                Complete Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden relative">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="p-4 md:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Point of Sale</h1>
            {/* Mobile Cart Trigger */}
            <div className="lg:hidden">
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative bg-white border-amber-200 text-amber-700 font-bold">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 border-none w-full sm:max-w-md">
                  <CartContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-bold border ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  if (item.prices.iced) setSelectedSize('iced');
                  else if (item.prices.solo) setSelectedSize('solo');
                  else setSelectedSize('default');
                  setItemDialogOpen(true);
                }}
                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all text-left flex flex-col group"
              >
                <h3 className="text-gray-900 font-bold mb-2 group-hover:text-amber-700 transition-colors">{item.name}</h3>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-amber-600">
                    {item.prices.iced && `₱${item.prices.iced}`}
                    {item.prices.hot && !item.prices.iced && `₱${item.prices.hot}`}
                    {item.prices.solo && `₱${item.prices.solo}`}
                    {item.prices.default && !item.prices.iced && !item.prices.hot && !item.prices.solo && `₱${item.prices.default}`}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">
                    {item.prices.iced ? 'Available Iced/Hot' : item.prices.solo ? 'Available Solo/Sharing' : 'Standard'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Cart */}
      <div className="hidden lg:flex w-96 bg-white border-l border-gray-200 flex-col shrink-0">
        <CartContent />
      </div>

      {/* Item Customization Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[60vh] overflow-auto pr-2">
            {selectedItem?.prices.iced && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-3">Select Size</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSize('iced')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      selectedSize === 'iced'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                        : 'border-gray-100 hover:border-amber-200'
                    }`}
                  >
                    <div className="text-sm font-bold">Iced</div>
                    <div className="text-xs text-amber-600 font-bold">₱{selectedItem.prices.iced}</div>
                  </button>
                  {selectedItem.prices.hot && (
                    <button
                      onClick={() => setSelectedSize('hot')}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        selectedSize === 'hot'
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                          : 'border-gray-100 hover:border-amber-200'
                      }`}
                    >
                      <div className="text-sm font-bold">Hot</div>
                      <div className="text-xs text-amber-600 font-bold">₱{selectedItem.prices.hot}</div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedItem?.prices.solo && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-3">Select Serving</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSize('solo')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      selectedSize === 'solo'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                        : 'border-gray-100 hover:border-amber-200'
                    }`}
                  >
                    <div className="text-sm font-bold">Solo</div>
                    <div className="text-xs text-amber-600 font-bold">₱{selectedItem.prices.solo}</div>
                  </button>
                  {selectedItem.prices.sharing && (
                    <button
                      onClick={() => setSelectedSize('sharing')}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        selectedSize === 'sharing'
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                          : 'border-gray-100 hover:border-amber-200'
                      }`}
                    >
                      <div className="text-sm font-bold">Sharing</div>
                      <div className="text-xs text-amber-600 font-bold">₱{selectedItem.prices.sharing}</div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedItem?.variants && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-3">Choose Flavor</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${
                        selectedVariant === variant
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                          : 'border-gray-100 hover:border-amber-200'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-3">Add-ons</p>
              <div className="grid grid-cols-1 gap-2">
                {addOns
                  .filter(
                    (addon) =>
                      (selectedCategory.includes('Coffee') ||
                        selectedCategory.includes('Matcha') ||
                        selectedCategory.includes('Frappe')) &&
                      addon.category === 'Drinks' ||
                      selectedCategory === 'Rice Meals' && addon.category === 'Rice Meals'
                  )
                  .map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => {
                        const exists = selectedAddOns.find((a) => a.name === addon.name);
                        if (exists) {
                          setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
                        } else {
                          setSelectedAddOns([...selectedAddOns, { name: addon.name, price: addon.price }]);
                        }
                      }}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                        selectedAddOns.find((a) => a.name === addon.name)
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                          : 'border-gray-100 hover:border-amber-200'
                      }`}
                    >
                      <span className="font-bold text-gray-700">{addon.name}</span>
                      <span className="text-amber-600 font-bold">+₱{addon.price}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Subtotal:</span>
              <span className="text-2xl font-bold text-amber-700">
                ₱
                {selectedItem ? (getItemPrice(selectedItem, selectedSize) +
                  selectedAddOns.reduce((sum, a) => sum + a.price, 0)).toLocaleString() : '0'}
              </span>
            </div>
            <DialogFooter>
              <Button onClick={addToCart} className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg font-bold rounded-xl shadow-lg shadow-amber-600/20">
                Add to Cart
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
