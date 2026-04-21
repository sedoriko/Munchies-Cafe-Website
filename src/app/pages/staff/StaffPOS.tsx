import { useState } from 'react';
import { menuItems, categories, addOns, MenuItem } from '../../data/menuData';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import { toast } from 'sonner';

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
  const [selectedCategory, setSelectedCategory] = useState('Coffee Based');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<'iced' | 'hot' | 'solo' | 'sharing' | 'default'>('default');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

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
    toast.success('Item added to cart');
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

  const getItemPrice = (item: MenuItem, size: string) => {
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

  const completeOrder = () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    toast.success(`Order completed! Payment: ${selectedPayment}`);
    setCart([]);
    setPaymentDialogOpen(false);
    setSelectedPayment('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl text-gray-900 mb-6">Point of Sale</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    if (item.prices.iced) setSelectedSize('iced');
                    else if (item.prices.solo) setSelectedSize('solo');
                    else setSelectedSize('default');
                  }}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-300 transition-all text-left"
                >
                  <h3 className="text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.prices.iced && `₱${item.prices.iced} (iced)`}
                    {item.prices.hot && !item.prices.iced && `₱${item.prices.hot} (hot)`}
                    {item.prices.solo && `₱${item.prices.solo} (solo)`}
                    {item.prices.default && !item.prices.iced && !item.prices.hot && !item.prices.solo && `₱${item.prices.default}`}
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedItem?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {selectedItem?.prices.iced && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Size</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSize('iced')}
                          className={`flex-1 px-4 py-2 rounded-lg border ${
                            selectedSize === 'iced'
                              ? 'border-amber-600 bg-amber-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-sm">Iced</div>
                          <div className="text-sm">₱{selectedItem.prices.iced}</div>
                        </button>
                        {selectedItem.prices.hot && (
                          <button
                            onClick={() => setSelectedSize('hot')}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              selectedSize === 'hot'
                                ? 'border-amber-600 bg-amber-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="text-sm">Hot</div>
                            <div className="text-sm">₱{selectedItem.prices.hot}</div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem?.prices.solo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Size</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSize('solo')}
                          className={`flex-1 px-4 py-2 rounded-lg border ${
                            selectedSize === 'solo'
                              ? 'border-amber-600 bg-amber-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-sm">Solo</div>
                          <div className="text-sm">₱{selectedItem.prices.solo}</div>
                        </button>
                        {selectedItem.prices.sharing && (
                          <button
                            onClick={() => setSelectedSize('sharing')}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              selectedSize === 'sharing'
                                ? 'border-amber-600 bg-amber-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="text-sm">Sharing</div>
                            <div className="text-sm">₱{selectedItem.prices.sharing}</div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem?.variants && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Flavor</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.variants.map((variant) => (
                          <button
                            key={variant}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-lg border ${
                              selectedVariant === variant
                                ? 'border-amber-600 bg-amber-50'
                                : 'border-gray-200'
                            }`}
                          >
                            {variant}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Add-ons</p>
                    <div className="space-y-2">
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
                            className={`w-full flex justify-between items-center px-4 py-2 rounded-lg border ${
                              selectedAddOns.find((a) => a.name === addon.name)
                                ? 'border-amber-600 bg-amber-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <span>{addon.name}</span>
                            <span>₱{addon.price}</span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {selectedItem && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Total Price:</span>
                        <span className="text-2xl text-amber-600">
                          ₱
                          {(getItemPrice(selectedItem, selectedSize) +
                            selectedAddOns.reduce((sum, a) => sum + a.price, 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={addToCart} className="w-full bg-amber-600 hover:bg-amber-700">
                    Add to Cart
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl text-gray-900">Current Order</h2>
          </div>
          <p className="text-sm text-gray-600">{cart.length} items</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-gray-900">
                        {item.name}
                        {item.size && ` (${item.size})`}
                        {item.variant && ` - ${item.variant}`}
                      </h3>
                      {item.addOns.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.addOns.map((addon, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              + {addon.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg text-gray-900">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₱{total.toLocaleString()}</span>
            </div>
          </div>

          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Checkout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <button
                  onClick={() => setSelectedPayment('Cash')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPayment === 'Cash'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-lg">Cash</div>
                  <div className="text-sm text-gray-600">Pay with cash</div>
                </button>
                <button
                  onClick={() => setSelectedPayment('Credit/Debit Card')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPayment === 'Credit/Debit Card'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-lg">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Pay with card</div>
                </button>
                <button
                  onClick={() => setSelectedPayment('GCash')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPayment === 'GCash'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-lg">GCash</div>
                  <div className="text-sm text-gray-600">Pay with GCash mobile wallet</div>
                </button>
                <button
                  onClick={() => setSelectedPayment('PayMaya')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPayment === 'PayMaya'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-lg">PayMaya</div>
                  <div className="text-sm text-gray-600">Pay with PayMaya mobile wallet</div>
                </button>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Total Amount:</span>
                  <span className="text-2xl text-amber-600">₱{total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={completeOrder}
                  disabled={!selectedPayment}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Complete Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
