import { MdMenu } from "react-icons/md";

function AdminHeader({ toggleSidebar, pageTitle }) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-6 lg:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
          >
            <MdMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <span className="sr-only">Notifications</span>
            <span className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">5</span>
            </span>
          </button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              AD
            </div>
            <span className="ml-2 text-sm font-medium hidden md:inline">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;