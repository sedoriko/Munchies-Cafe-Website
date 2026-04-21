import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { employees } from '../../data/mockData';
import { toast } from 'sonner';

export default function TimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [clockedInStaff, setClockedInStaff] = useState(
    employees.filter((emp) => emp.clockedIn).map((emp) => ({
      ...emp,
      clockInTime: emp.lastClockIn || new Date(),
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (!employee) return;

    const alreadyClockedIn = clockedInStaff.find((staff) => staff.id === selectedEmployee);
    if (alreadyClockedIn) {
      toast.error(`${employee.name} is already clocked in`);
      return;
    }

    setClockedInStaff([
      ...clockedInStaff,
      {
        ...employee,
        clockedIn: true,
        clockInTime: new Date(),
      },
    ]);

    toast.success(`${employee.name} clocked in successfully`);
    setSelectedEmployee('');
  };

  const handleClockOut = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    const staffMember = clockedInStaff.find((staff) => staff.id === employeeId);
    if (!staffMember) return;

    const hoursWorked = (new Date().getTime() - staffMember.clockInTime.getTime()) / (1000 * 60 * 60);

    setClockedInStaff(clockedInStaff.filter((staff) => staff.id !== employeeId));
    toast.success(`${employee.name} clocked out. Hours worked: ${hoursWorked.toFixed(2)}`);
  };

  const getHoursWorked = (clockInTime: Date) => {
    const hours = (currentTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Time Clock</h1>
        <p className="text-gray-600">Manage employee shifts and time tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-100 p-6 rounded-full mb-4">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
            <div className="text-5xl text-gray-900 mb-2">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-lg text-gray-600">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="">Choose employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleClockIn}
              disabled={!selectedEmployee}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Clock In
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-xl text-gray-900 mb-6">Currently Clocked In</h2>

          {clockedInStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <User className="w-16 h-16 mb-4" />
              <p>No employees clocked in</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clockedInStaff.map((staff) => (
                <div key={staff.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white text-lg">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-gray-900">{staff.name}</h3>
                        <p className="text-sm text-gray-600">{staff.position}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleClockOut(staff.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Clock Out
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Clock In Time</p>
                      <p className="text-gray-900">
                        {staff.clockInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hours Worked</p>
                      <p className="text-gray-900">{getHoursWorked(staff.clockInTime)} hrs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
