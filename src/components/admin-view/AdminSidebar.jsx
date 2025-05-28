import {
  MdDashboard,
  MdSchedule,
  MdLogout,
  MdDesignServices,
  MdPeople,
  MdAccessTime,
  MdReport,
} from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth-slice";
import { useDispatch } from "react-redux";
import { useState } from "react";

// Export the menu items to be used elsewhere
export const adminMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={22} />,
    path: "/admin/dashboard",
  },
  {
    id: "manage-services",
    label: "Manage Category",
    icon: <MdDesignServices size={22} />,
    path: "/admin/category",
  },
  {
    id: "manage-time-slots",
    label: "Manage Time Slot",
    icon: <MdAccessTime size={22} />,
    path: "/admin/time-slots",
  },
  {
    id: "bookings",
    label: "All Bookings",
    icon: <MdSchedule size={22} />,
    path: "/admin/bookings",
  },
  {
    id: "users",
    label: "User Management",
    icon: <MdPeople size={22} />,
    path: "/admin/users",
  },
  {
    id: "receptionists",
    label: "Manage Receptionists",
    icon: <FaUserPlus size={22} />,
    path: "/admin/receptionists",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: <MdReport size={22} />,
    path: "/admin/reports",
  },
];

function AdminSidebar({ closeSidebar }) {

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
  e.preventDefault();
  setIsLoggingOut(true);
  try {
    await dispatch(logoutUser()).unwrap();
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    setIsLoggingOut(false);
  }
};
  const SidebarNavLink = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={closeSidebar}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500 shadow"
            : "text-gray-600 hover:bg-blue-300 hover:text-blue-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? "text-blue-600" : "text-gray-500"}>
            {item.icon}
          </span>
          <span className={isActive ? "font-semibold" : "font-medium"}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-blue-50 to-white p-6 shadow-xl border-r border-blue-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl shadow-md">
          <MdDashboard size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Admin Panel</h1>
          <p className="text-sm text-blue-600">Management Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {adminMenuItems.map((item) => (
          <SidebarNavLink key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 mt-1 transition-all duration-200 ${
          isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <MdLogout size={22} className="text-gray-500" />
        <span className="font-medium">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      </button>
    </div>
  );
}

export default AdminSidebar;
