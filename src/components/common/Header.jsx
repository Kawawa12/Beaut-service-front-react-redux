// components/common/Header.js
import { FaUser, FaCalendarAlt, FaLock, FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ 
  isMenuOpen,
  setIsMenuOpen,
  mobileMenuRef,
  profileDropdownRef,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen
}) => {
  return (
    <>
      {/* Desktop Header */}
      <header className="fixed w-full bg-gray-900/95 backdrop-blur-md py-8 top-0 z-50 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-white font-serif">
              <span className="text-pink-400">Beauté</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "About Us", "Services", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(' ', '-')}`}
                className="text-white hover:text-pink-300 text-lg transition font-medium relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-6">
              <Link
                to="/login"
                className="bg-transparent hover:bg-pink-600 text-white px-6 py-2 rounded-full border border-pink-400 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full transition font-medium shadow-lg"
              >
                Sign Up
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition flex items-center justify-center"
                >
                  <FaUser />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-semibold text-white">
                        user@example.com
                      </p>
                    </div>
                    {[
                      {
                        text: "My Profile",
                        icon: <FaUser className="text-pink-400" />,
                        link: "/profile"
                      },
                      {
                        text: "My Bookings",
                        icon: <FaCalendarAlt className="text-pink-400" />,
                        link: "/bookings"
                      },
                      {
                        text: "Change Password",
                        icon: <FaLock className="text-pink-400" />,
                        link: "/change-password"
                      },
                      {
                        text: "Sign Out",
                        icon: <FaArrowRight className="text-pink-400" />,
                        link: "/logout"
                      },
                    ].map(({ text, icon, link }) => (
                      <Link
                        key={text}
                        to={link}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition"
                      >
                        <span className="mr-3">{icon}</span>
                        <span>{text}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={mobileMenuRef}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* General Menu */}
          {["Home", "About Us", "Services", "Contact", "Sign In", "Sign Up"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase().replace(' ', '-')}`}
              className="flex items-center py-3 text-gray-300 hover:text-white font-medium transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaArrowRight className="mr-3 text-pink-400" /> {item}
            </Link>
          ))}

          {/* My Account Section */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              My Account
            </h3>
            {[
              { text: "My Profile", icon: <FaUser className="text-pink-400" />, link: "/profile" },
              { text: "My Bookings", icon: <FaCalendarAlt className="text-pink-400" />, link: "/bookings" },
              { text: "Change Password", icon: <FaLock className="text-pink-400" />, link: "/change-password" },
            ].map(({ text, icon, link }) => (
              <Link
                key={text}
                to={link}
                className="flex items-center py-3 text-gray-300 hover:text-white font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{icon}</span> {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;