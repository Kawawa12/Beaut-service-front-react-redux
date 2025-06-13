import { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaTimes, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, selectIsAuthenticated } from "../../../features/auth-slice";
import { selectAuthLoading } from "../../../features/auth-slice";

const ServiceHeader = ({ 
  isMenuOpen,
  setIsMenuOpen,
  mobileMenuRef
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const isLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Handle outside click to close profile dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLinkClick = (e, link) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsMenuOpen(false);
      navigate('/login');
    } else {
      setIsMenuOpen(false);
      navigate(link);
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
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition flex items-center justify-center"
                aria-label="Profile"
              >
                <FaUser />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-gray-300">Signed in as</p>
                    <p className="text-sm font-semibold text-white">
                      {isAuthenticated ? 'user@example.com' : 'Guest'}
                    </p>
                  </div>
                  {[
                    {
                      text: "My Profile",
                      icon: <FaUser className="text-pink-400" />,
                      link: "/my-profile",
                    },
                    {
                      text: "My Bookings",
                      icon: <FaCalendarAlt className="text-pink-400" />,
                      link: "/my-bookings",
                    },
                    {
                      text: isLoggingOut ? "Logging out..." : "Logout",
                      icon: <FaSignOutAlt className="text-pink-400" />,
                      onClick: handleLogout
                    }
                  ].map(({ text, icon, link, onClick }) => (
                    <Link
                      key={text}
                      to={link || '#'}
                      onClick={(e) => {
                        if (onClick) {
                          onClick(e);
                        } else {
                          handleLinkClick(e, link);
                        }
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition"
                    >
                      <span className="mr-3">{icon}</span>
                      <span>{text}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            aria-label="Close Menu"
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

          {/* My Account Section */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              My Account
            </h3>
            {[
              { 
                text: "My Profile", 
                icon: <FaUser className="text-pink-400" />, 
                link: "/my-profile",
              },
              { 
                text: "My Bookings", 
                icon: <FaCalendarAlt className="text-pink-400" />, 
                link: "/my-bookings",
              },
              { 
                text: isLoggingOut ? "Logging out..." : "Logout", 
                icon: <FaSignOutAlt className="text-pink-400" />, 
                onClick: handleLogout
              }
            ].map(({ text, icon, link, onClick }) => (
              <Link
                key={text}
                to={link || '#'}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e);
                  } else {
                    handleLinkClick(e, link);
                  }
                }}
                className="flex items-center py-4 text-gray-300 hover:text-white text-xl font-medium transition"
              >
                <span className="mr-4">{icon}</span>
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceHeader;