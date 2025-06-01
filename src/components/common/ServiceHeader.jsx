// components/common/ServiceHeader.js
import { useState } from 'react';
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth-slice";
import { selectAuthLoading } from "../../../features/auth-slice";

const ServiceHeader = ({ 
  isMenuOpen,
  setIsMenuOpen,
  mobileMenuRef
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoading = useSelector(selectAuthLoading);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed w-full bg-gray-900/95 backdrop-blur-md py-6 top-0 z-50 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-white font-serif">
              <span className="text-pink-400">Beauté Services</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {["Home", "Services"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-white hover:text-pink-300 text-xl transition font-medium relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading || isLoggingOut}
              className="flex items-center space-x-3 text-white hover:text-pink-300 transition text-xl"
            >
              <span>Logout</span>
              {isLoggingOut ? (
                <span className="animate-spin">↻</span>
              ) : (
                <FaSignOutAlt className="text-2xl" />
              )}
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={mobileMenuRef}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Main Menu Items */}
          {["Home", "Services"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="flex items-center py-4 text-gray-300 hover:text-white text-xl font-medium transition"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={(e) => {
              handleLogout(e);
              setIsMenuOpen(false);
            }}
            disabled={isLoading || isLoggingOut}
            className="flex items-center py-4 text-gray-300 hover:text-white text-xl font-medium transition w-full"
          >
            <FaSignOutAlt className="mr-4 text-2xl text-pink-400" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceHeader;