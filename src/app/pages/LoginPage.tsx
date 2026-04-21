import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Coffee } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const [role, setRole] = useState<'owner' | 'staff' | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === 'owner') {
      navigate('/owner');
    } else if (role === 'staff') {
      navigate('/staff');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="bg-white p-12 rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-600 p-4 rounded-full mb-4">
            <Coffee className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl text-amber-900 mb-2">Munchies Cafe</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setRole('owner')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              role === 'owner'
                ? 'border-amber-600 bg-amber-50'
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="text-left">
              <div className="text-xl mb-1">Owner Dashboard</div>
              <div className="text-sm text-gray-600">
                Analytics, inventory, and employee management
              </div>
            </div>
          </button>

          <button
            onClick={() => setRole('staff')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              role === 'staff'
                ? 'border-amber-600 bg-amber-50'
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="text-left">
              <div className="text-xl mb-1">Staff POS</div>
              <div className="text-sm text-gray-600">
                Process orders and manage shifts
              </div>
            </div>
          </button>
        </div>

        <Button
          onClick={handleLogin}
          disabled={!role}
          className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
