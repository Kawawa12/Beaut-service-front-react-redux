import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ReceptionistHeader from "../../components/receptionist-view/ReceptionistHeader";
import ReceptionistSidebar from "../../components/receptionist-view/ReceptionistSidebar";
import { ReceptionistItems } from "../common/receptionItems";

function ReceptionistLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();

  // Automatically update page title based on current route
  useEffect(() => {
    const currentMenuItem = ReceptionistItems.find(item => 
      location.pathname.startsWith(item.path)
    );
    setPageTitle(currentMenuItem?.label || "Dashboard");
    document.title = `${currentMenuItem?.label || "Dashboard"} | Beauty Salon`;
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex w-full fixed min-h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static z-30 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72`}>
        <ReceptionistSidebar closeSidebar={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ReceptionistHeader 
          toggleSidebar={toggleSidebar} 
          pageTitle={pageTitle} 
        />
        
        <main className="flex-1 bg-white lg:rounded-tl-2xl shadow-inner overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ReceptionistLayout;