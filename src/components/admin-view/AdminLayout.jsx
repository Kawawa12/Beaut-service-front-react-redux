import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar, { adminMenuItems } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
 

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();

  // Automatically update page title based on current route
  useEffect(() => {
    const currentMenuItem = adminMenuItems.find(item => 
      location.pathname.startsWith(item.path)
    );
    setPageTitle(currentMenuItem?.label || "Dashboard");
    
    // Update document title as well
    document.title = `${currentMenuItem?.label || "Dashboard"} | Admin Panel`;
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
    <div className="flex w-full min-h-screen fixed overflow-hidden bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static z-30 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72`}>
        <AdminSidebar closeSidebar={closeSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          pageTitle={pageTitle} 
        />
        
        <main className="flex-1 overflow-y-auto bg-white lg:rounded-tl-2xl shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

 