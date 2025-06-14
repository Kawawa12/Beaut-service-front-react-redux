// src/pages/admin/Reports.jsx
import { MdReport, MdBarChart, MdPieChart, MdDateRange } from "react-icons/md";
import { useState } from "react";

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("bookings");

  // Sample data - in a real app, this would come from an API
  const reportData = {
    bookings: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [65, 59, 80, 81, 56, 55],
    },
    revenue: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [12500, 19000, 15000, 21000, 18000, 22000],
    },
    services: {
      labels: ["Facials", "Massages", "Waxing", "Manicures", "Hair"],
      data: [45, 30, 15, 25, 20],
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MdReport className="text-2xl text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setTimeRange("weekly")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "weekly" ? "bg-purple-600 text-white" : "text-gray-700"}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "monthly" ? "bg-purple-600 text-white" : "text-gray-700"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange("yearly")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "yearly" ? "bg-purple-600 text-white" : "text-gray-700"}`}
          >
            Yearly
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MdDateRange />
          <span>Last 6 {timeRange === "weekly" ? "Weeks" : timeRange === "monthly" ? "Months" : "Years"}</span>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "bookings" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            <MdBarChart className="inline mr-2" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "revenue" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            <MdBarChart className="inline mr-2" />
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "services" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            <MdPieChart className="inline mr-2" />
            Services
          </button>
        </nav>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {activeTab === "bookings" && "Bookings Report"}
          {activeTab === "revenue" && "Revenue Report"}
          {activeTab === "services" && "Service Popularity"}
        </h2>

        {/* In a real app, you would use a chart library like Chart.js here */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-6">
          <div className="text-center text-gray-500">
            <p className="text-lg">📊 Chart visualization would appear here</p>
            <p className="text-sm mt-2">
              Showing {timeRange} data for: {reportData[activeTab].labels.join(", ")}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === "services" ? "Service" : "Period"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === "revenue" ? "Amount ($)" : "Count"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData[activeTab].labels.map((label, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeTab === "revenue" 
                      ? `$${reportData[activeTab].data[index].toLocaleString()}` 
                      : reportData[activeTab].data[index]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${index > 0 && reportData[activeTab].data[index] > reportData[activeTab].data[index-1] 
                        ? 'bg-green-100 text-green-800' 
                        : index > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {index > 0 
                        ? reportData[activeTab].data[index] > reportData[activeTab].data[index-1] 
                          ? `↑ ${Math.round((reportData[activeTab].data[index]/reportData[activeTab].data[index-1]-1)*100)}%` 
                          : `↓ ${Math.round((1-reportData[activeTab].data[index]/reportData[activeTab].data[index-1])*100)}%`
                        : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-sm font-medium text-purple-800">Total {activeTab === "revenue" ? "Revenue" : "Bookings"}</h3>
            <p className="text-2xl font-bold text-purple-600">
              {activeTab === "revenue" 
                ? `$${reportData[activeTab].data.reduce((a,b) => a+b, 0).toLocaleString()}` 
                : reportData[activeTab].data.reduce((a,b) => a+b, 0)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800">Average per {timeRange.slice(0, -2)}</h3>
            <p className="text-2xl font-bold text-blue-600">
              {activeTab === "revenue" 
                ? `$${Math.round(reportData[activeTab].data.reduce((a,b) => a+b, 0)/reportData[activeTab].data.length).toLocaleString()}` 
                : Math.round(reportData[activeTab].data.reduce((a,b) => a+b, 0)/reportData[activeTab].data.length)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm font-medium text-green-800">Growth Rate</h3>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                ((reportData[activeTab].data[reportData[activeTab].data.length-1] - reportData[activeTab].data[0]) / 
                 reportData[activeTab].data[0]) * 100
              )}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;