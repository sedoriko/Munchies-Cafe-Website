import { useState, useEffect } from 'react';
import { employees as initialEmployees, Employee } from '../data/mockData';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('munchies_employees');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        return parsed.map((emp: any) => ({
          ...emp,
          lastClockIn: emp.lastClockIn ? new Date(emp.lastClockIn) : undefined
        }));
      } catch (e) {
        console.error('Failed to parse saved employees', e);
      }
    }
    return initialEmployees;
  });

  useEffect(() => {
    localStorage.setItem('munchies_employees', JSON.stringify(employees));
    // Also trigger a storage event for other tabs/windows if needed, 
    // although within the same app session this state change should be reflected
    // if the component using the hook re-renders.
  }, [employees]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'munchies_employees' && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setEmployees(parsed.map((emp: any) => ({
          ...emp,
          lastClockIn: emp.lastClockIn ? new Date(emp.lastClockIn) : undefined
        })));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const clockIn = (id: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, clockedIn: true, lastClockIn: new Date() } : emp
    ));
  };

  const clockOut = (id: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, clockedIn: false } : emp
    ));
  };

  return { employees, clockIn, clockOut };
}
