import { MdLogout, MdSpa } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { ReceptionistItems } from "../common/receptionItems";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../features/auth-slice";
 



function ReceptionistSidebar({ closeSidebar }) {

  const receptionItems = ReceptionistItems;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Enhanced NavLink component that closes sidebar on click
  const SidebarNavLink = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={closeSidebar}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500 shadow-md' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
            {item.icon}
          </span>
          <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
        </>
      )}
    </NavLink>
  );

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout: ", error);
    } finally {
      setIsLoggingOut(false)
    }

  }

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-blue-50 to-white p-6 shadow-xl border-r border-blue-100 flex flex-col">
      {/* Header with Profile */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl shadow-md">
          <MdSpa size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Beauty Salon</h1>
          <p className="text-sm text-blue-600">Reception Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {receptionItems.map((item) => (
          <SidebarNavLink key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-blue-100">
        <SidebarNavLink item={{
          id: 'settings',
          label: 'Settings',
          icon: <IoMdSettings size={22} />,
          path: '/reception/settings'
        }} />
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
    </div>
  );
}

export default ReceptionistSidebar;