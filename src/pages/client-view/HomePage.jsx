import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaLock,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import LoginForm from "../auth-page/Login";
import RegisterForm from "../auth-page/Register";


const services = [
  {
    name: "Hair Styling",
    image: "/assets/hero.jpg",
    description:
      "Professional cuts, coloring, and styling tailored to your unique look",
  },
  {
    name: "Facial Treatment",
    image: "/assets/facial.jpg",
    description:
      "Rejuvenating facials using premium organic products for glowing skin",
  },
  {
    name: "Nail Art",
    image: "/assets/nail.jpg",
    description: "Creative manicures and pedicures with long-lasting polish",
  },
  {
    name: "Massage Therapy",
    image: "/assets/massage.jpg",
    description: "Relaxing therapeutic massages to relieve stress and tension",
  },
];

const BeautyHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [showLoginModel, setShowLoginModel] = useState(false);
  const [showRegisterModel, setShowRegisterModel] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('button[aria-label="Menu"]')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Header */}
      <header className="fixed w-full bg-transparent backdrop-blur-sm py-8 top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo with mirror effect */}
          <h1 className="text-3xl font-bold text-white font-serif relative">
            <span className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/20 bg-clip-text font-bold lg:text-5xl text-pink-700">
              Beauté
            </span>
            <span className="text-transparent">Beauté</span>
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "About Us", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-blue-800 text-xl  text-pink-700 transition font-semibold relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLoginModel(true);
              }}
              className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-full backdrop-blur-sm border transition shadow font-medium"
            >
              Sign In
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowRegisterModel(true);
              }}
              className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-full backdrop-blur-sm border transition shadow font-medium"
            >
              Sign Up
            </a>
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition flex items-center justify-center"
              >
                <FaUser />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl z-50 border border-white/20 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-gray-700">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900">
                      user@example.com
                    </p>
                  </div>
                  {[
                    {
                      text: "My Profile",
                      icon: <FaUser className="text-pink-500" />,
                    },
                    {
                      text: "My Bookings",
                      icon: <FaCalendarAlt className="text-pink-500" />,
                    },
                    {
                      text: "Change Password",
                      icon: <FaLock className="text-pink-500" />,
                    },
                    {
                      text: "Sign Out",
                      icon: <FaArrowRight className="text-pink-500" />,
                    },
                  ].map(({ text, icon }) => (
                    <a
                      key={text}
                      href="#"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 transition"
                    >
                      <span className="mr-3">{icon}</span>
                      <span>{text}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-pink-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
     <div
  className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  }`}
  ref={mobileMenuRef}
>
  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
    <h2 className="text-xl font-bold text-pink-600">Menu</h2>
    <button
      onClick={() => setIsMenuOpen(false)}
      className="text-gray-500 hover:text-gray-700"
    >
      <FaTimes size={20} />
    </button>
  </div>

  <div className="p-6">
    {/* General Menu */}
    {["Home", "About Us", "Contact", "Sign In", "Sign Up"].map((item) => (
      <a
        key={item}
        href="#"
        className="flex items-center py-3 text-gray-700 hover:text-pink-600 font-medium transition"
      >
        <FaArrowRight className="mr-3 text-pink-400" /> {item}
      </a>
    ))}

    {/* My Account Section */}
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        My Account
      </h3>
      {[
        { text: "My Profile", icon: <FaUser /> },
        { text: "My Bookings", icon: <FaCalendarAlt /> },
        { text: "Change Password", icon: <FaLock /> },
      ].map(({ text, icon }) => (
        <a
          key={text}
          href="#"
          className="flex items-center py-3 text-gray-700 hover:text-pink-600 font-medium transition"
        >
          <span className="mr-3 text-pink-400">{icon}</span> {text}
        </a>
      ))}
    </div>
  </div>
</div>


      {/* Single Hero Section */}
      <section className="relative w-full h-screen max-h-[900px] overflow-hidden bg-pink-50">
        {/* Background image with subtle overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/hero.jpg"
            alt="Luxury beauty salon"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10"></div>
        </div>

        {/* Content container */}
        <div className="relative h-full container mx-auto px-6 flex items-center">
          {/* Left side description */}
          <div className="hidden md:block w-1/3 pr-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-pink-600 mb-4 font-serif">
                Our Signature Services
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✦</span>
                  <span className="text-gray-700">Bridal Makeup Packages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✦</span>
                  <span className="text-gray-700">
                    Organic Facial Treatments
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✦</span>
                  <span className="text-gray-700">Luxury Hair Spa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✦</span>
                  <span className="text-gray-700">Professional Nail Art</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Center content */}
          <div className="w-full md:w-1/3 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pink-600 mb-6 font-serif">
              Elevate Your Beauty
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 mx-auto max-w-md">
              Premium beauty services tailored for the modern woman
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-medium shadow-lg transition-all transform hover:scale-105">
                Book Now
              </button>
              <button className="bg-white/90 hover:bg-white text-pink-600 px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-medium shadow-lg transition-all transform hover:scale-105">
                View Services
              </button>
            </div>
          </div>

          {/* Right side description */}
          <div className="hidden md:block w-1/3 pl-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-pink-600 mb-4 font-serif">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✓</span>
                  <span className="text-gray-700">
                    Certified Beauty Experts
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✓</span>
                  <span className="text-gray-700">
                    Premium Quality Products
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✓</span>
                  <span className="text-gray-700">
                    Hygienic & Safe Environment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-3">✓</span>
                  <span className="text-gray-700">
                    Personalized Consultations
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile floating info (shown only on mobile) */}
        <div className="md:hidden absolute bottom-8 left-0 right-0 px-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mx-auto max-w-md">
            <div className="flex justify-between">
              <div className="pr-4">
                <h4 className="font-bold text-pink-600 mb-2">Services</h4>
                <p className="text-sm text-gray-700">
                  Bridal • Facial • Hair • Nails
                </p>
              </div>
              <div className="pl-4 border-l border-pink-100">
                <h4 className="font-bold text-pink-600 mb-2">Benefits</h4>
                <p className="text-sm text-gray-700">
                  Experts • Quality • Hygiene
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-pink-600 mb-4 font-serif">
              Our Premium Services
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Indulge in our carefully curated beauty treatments designed to
              enhance your natural beauty
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 h-96"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {service.name}
                  </h4>
                  <p className="text-gray-200 mb-4">{service.description}</p>
                  <button className="text-pink-300 hover:text-white font-medium flex items-center">
                    Learn more <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {showLoginModel && (
            <LoginForm
              onClose={() => setShowLoginModel(false)}
              onSwitchToRegister={() => {
                setShowLoginModel(false);
                setShowRegisterModel(true)
              }}
            />
          )}

          {showRegisterModel && (
            <RegisterForm
              onClose={() => setShowRegisterModel(false)}
              onSwitchToLogin={() => {
                setShowRegisterModel(false);
                setShowLoginModel(true);
              }}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h4 className="text-2xl font-bold text-pink-400 mb-4 font-serif">
                Beauté
              </h4>
              <p className="text-gray-400 mb-4">
                Your premier destination for luxury beauty treatments and
                personalized care.
              </p>
              <div className="flex space-x-4">
                {[FaInstagram, FaFacebook, FaTwitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                {["Home", "Services", "About Us", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-pink-400 transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.name}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-pink-400 transition"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 text-pink-400" />
                  <span className="text-gray-400">
                    123 Beauty Ave, Glamour City
                  </span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-3 text-pink-400" />
                  <span className="text-gray-400">(555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-3 text-pink-400" />
                  <span className="text-gray-400">info@beaute.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Beauté. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BeautyHomePage;
