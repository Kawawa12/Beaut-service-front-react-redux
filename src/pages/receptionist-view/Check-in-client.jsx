// src/pages/reception/CheckInClients.jsx
import { BiUserCheck } from "react-icons/bi";
import { useState } from "react";

const CheckInClients = () => {
  // Sample data - in a real app, this would come from your backend
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: "Sarah Johnson",
      service: "Full Body Massage",
      time: "10:00 AM",
      status: "upcoming", // upcoming, checked-in, cancelled, no-show
      phone: "+1 (555) 123-4567",
      email: "sarah.j@example.com"
    },
    {
      id: 2,
      clientName: "Emily Davis",
      service: "Facial Treatment",
      time: "11:30 AM",
      status: "upcoming",
      phone: "+1 (555) 987-6543",
      email: "emily.d@example.com"
    },
    {
      id: 3,
      clientName: "Jessica Wilson",
      service: "Manicure & Pedicure",
      time: "2:00 PM",
      status: "upcoming",
      phone: "+1 (555) 456-7890",
      email: "jessica.w@example.com"
    }
  ]);

  const [walkInClient, setWalkInClient] = useState({
    name: "",
    service: "",
    phone: ""
  });

  const handleCheckIn = (appointmentId) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId ? { ...app, status: "checked-in" } : app
    ));
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    const newWalkIn = {
      id: appointments.length + 1,
      clientName: walkInClient.name,
      service: walkInClient.service,
      time: "Now",
      status: "checked-in",
      phone: walkInClient.phone,
      email: ""
    };
    setAppointments([...appointments, newWalkIn]);
    setWalkInClient({ name: "", service: "", phone: "" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BiUserCheck className="text-2xl text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">Check-In Clients</h1>
      </div>

      {/* Scheduled Appointments Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Today's Appointments</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{appointment.clientName}</div>
                    <div className="text-sm text-gray-500">{appointment.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${appointment.status === 'checked-in' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {appointment.status === 'upcoming' && (
                      <button
                        onClick={() => handleCheckIn(appointment.id)}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Walk-In Clients Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Walk-In Clients</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleWalkInSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={walkInClient.name}
                  onChange={(e) => setWalkInClient({...walkInClient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  id="service"
                  value={walkInClient.service}
                  onChange={(e) => setWalkInClient({...walkInClient, service: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Facial Treatment">Facial Treatment</option>
                  <option value="Full Body Massage">Full Body Massage</option>
                  <option value="Manicure & Pedicure">Manicure & Pedicure</option>
                  <option value="Hair Styling">Hair Styling</option>
                  <option value="Waxing">Waxing</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={walkInClient.phone}
                  onChange={(e) => setWalkInClient({...walkInClient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Check In Walk-In Client
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CheckInClients;