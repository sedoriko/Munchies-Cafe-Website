import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Delete, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }

    setIsSubmitting(true);
    const result = await login(pin);
    
    if (result.success) {
      toast.success('Login successful');
      // The ProtectedRoute logic or a simple check here can handle redirection
      // but let's re-fetch the user role to decide where to go.
      // For now, let's assume the AuthContext update will trigger a re-render or we can navigate manually.
      // We'll use a timeout to let the state settle
      setTimeout(() => {
        const savedUser = localStorage.getItem('munchies_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          navigate(user.role === 'owner' ? '/owner' : '/staff');
        }
      }, 100);
    } else {
      toast.error(result.error || 'Invalid PIN');
      setPin('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img src="/logo_clr.png" alt="Munchies Cafe Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-3xl text-amber-900 mb-1 font-bold">Munchies Cafe</h1>
          <p className="text-gray-600">Enter your PIN to login</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? 'bg-amber-600 border-amber-600'
                  : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-16 text-2xl font-semibold bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 rounded-xl transition-colors border border-gray-100"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-16 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl transition-colors border border-gray-100"
          >
            <Delete className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-16 text-2xl font-semibold bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 rounded-xl transition-colors border border-gray-100"
          >
            0
          </button>
          <button
            onClick={() => setPin('')}
            className="h-16 flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors border border-gray-100"
          >
            Clear
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={pin.length < 4 || isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-bold shadow-lg transition-transform active:scale-95"
        >
          {isSubmitting ? 'Verifying...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
