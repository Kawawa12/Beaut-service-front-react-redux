import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Header = ({ 
  isMenuOpen,
  setIsMenuOpen,
  mobileMenuRef
}) => {
  const navItems = ["Home", "About Us", "Services", "Contact"];
  const authItems = ["Sign In", "Sign Up"];

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed w-full bg-gray-900/95 backdrop-blur-md py-8 top-0 z-50 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="text-3xl font-bold text-white font-serif">
              <span className="text-pink-400">Beauté Services</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(' ', '-')}`}
                className={({ isActive }) => 
                  `text-white text-lg font-medium relative group transition after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-pink-400 after:transition-all after:duration-300 ${
                    isActive
                      ? 'text-pink-400 after:w-full'
                      : 'hover:text-pink-300 after:w-0 group-hover:after:w-full'
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
            
            <div className="flex items-center space-x-4 ml-6">
              <NavLink
                to="/login"
                className={({ isActive }) => 
                  `bg-transparent text-white px-6 py-2 rounded-full border border-pink-400 font-medium transition ${
                    isActive ? 'bg-pink-600 text-white' : 'hover:bg-pink-600 hover:text-white'
                  }`
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => 
                  `bg-pink-600 text-white px-6 py-2 rounded-full font-medium shadow-lg transition ${
                    isActive ? 'bg-pink-700' : 'hover:bg-pink-700'
                  }`
                }
              >
                Sign Up
              </NavLink>
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

        <div className="p-6 space-y-4">
          {/* General Menu */}
          {navItems.map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase().replace(' ', '-')}`}
              className={({ isActive }) => 
                `flex items-center py-3 font-medium transition ${
                  isActive ? 'text-pink-400' : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FaArrowRight className="mr-3 text-pink-400" /> {item}
            </NavLink>
          ))}
          {/* Auth Menu */}
          {authItems.map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase().replace(' ', '-')}`}
              className={({ isActive }) => 
                `flex items-center py-3 px-6 rounded-full font-medium transition ${
                  item === 'Sign In'
                    ? `border border-pink-400 ${
                        isActive ? 'bg-pink-600 text-white' : 'text-gray-300 hover:bg-pink-600 hover:text-white'
                      }`
                    : `bg-pink-600 text-white ${
                        isActive ? 'bg-pink-700' : 'hover:bg-pink-700'
                      }`
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FaArrowRight className="mr-3 text-white" /> {item}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;