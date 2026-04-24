import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Employee {
  id: string;
  name: string;
  role: 'owner' | 'staff';
  pin: string;
}

interface AuthContextType {
  user: Employee | null;
  loading: boolean;
  login: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('munchies_user');
      if (savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
      localStorage.removeItem('munchies_user');
    }
    setLoading(false);
  }, []);

  const login = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Database connection not configured' };
    }
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('pin', pin)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid PIN' };
      }

      const employee = data as Employee;
      setUser(employee);
      localStorage.setItem('munchies_user', JSON.stringify(employee));
      return { success: true };
    } catch (err) {
      console.error('Auth error:', err);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('munchies_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
