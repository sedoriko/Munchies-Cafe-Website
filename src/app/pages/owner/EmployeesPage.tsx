import { employees } from '../../data/mockData';
import { User, Mail, Phone, DollarSign, Clock } from 'lucide-react';

export default function EmployeesPage() {
  const clockedInEmployees = employees.filter((emp) => emp.clockedIn);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Employees</h1>
        <p className="text-gray-600">Manage your team and view employee profiles</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl text-gray-900 mb-4">Currently Clocked In</h2>
        {clockedInEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clockedInEmployees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900">{emp.name}</p>
                  <p className="text-sm text-gray-600">
                    Since {emp.lastClockIn?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No employees currently clocked in</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl text-gray-900">{emp.name}</h3>
                    <p className="text-gray-600">{emp.position}</p>
                  </div>
                  {emp.clockedIn && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      <Clock className="w-4 h-4" />
                      Clocked In
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    emp.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {emp.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{emp.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{emp.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span>₱{emp.hourlyRate}/hour</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
