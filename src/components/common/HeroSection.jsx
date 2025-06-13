import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const goToBeautServices = () => {
    navigate("/services");
  };

  const goToEventContact = () => {
    navigate("/contact");
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden mt-16">
      {/* Background image with enhanced overlay */}
      <div className="absolute inset-0 h-[70vh]">
        <img
          src="/assets/hero_section.jpg"
          alt="Luxury beauty salon"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
      </div>

      {/* Main content with centered alignment */}
      <div className="relative flex flex-col">
        {/* Hero content area */}
        <div className="h-[70vh] w-full relative flex items-center justify-center">
          <div className="text-center px-6 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif tracking-tight"
            >
              Elevate Your <span className="text-pink-300">Beauty</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-8 mx-auto max-w-2xl"
            >
              Premium beauty services and event transformations tailored for the modern woman
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={goToBeautServices}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg transition-all transform hover:scale-105"
              >
                Book Now
              </button>
              <button 
                onClick={goToBeautServices}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg backdrop-blur-sm transition-all transform hover:scale-105"
              >
                View Services
              </button>
              <button 
                onClick={goToEventContact}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Plan an Event <FaCalendarAlt className="ml-2" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Blackish background for cards section */}
        <div className="bg-gray-900 relative pt-32 pb-20">
          {/* Cards container with transparent cards */}
          <div className="container mx-auto px-6 -mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Signature Services Card */}
              <motion.div 
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:border-pink-400/50 transform transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Our Signature Services
                </h3>
                <ul className="space-y-4">
                  {["Bridal Makeup Packages", "Organic Facial Treatments", "Luxury Hair Spa", "Professional Nail Art"].map((service) => (
                    <li key={service} className="flex items-start">
                      <span className="text-pink-400 mr-3">✦</span>
                      <span className="text-white/90">{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Why Choose Us Card */}
              <motion.div 
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:border-pink-400/50 transform transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Why Choose Us?
                </h3>
                <ul className="space-y-4">
                  {["Certified Beauty Experts", "Premium Quality Products", "Hygienic & Safe Environment", "Personalized Consultations"].map((reason) => (
                    <li key={reason} className="flex items-start">
                      <span className="text-pink-400 mr-3">✓</span>
                      <span className="text-white/90">{reason}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Special Offer Card */}
              <motion.div 
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="bg-pink-600/90 backdrop-blur-sm p-8 rounded-xl border border-pink-400/30 transform transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  Special Offer
                </h3>
                <p className="text-white/90 mb-6">
                  Get 15% off your first appointment when you book online!
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToBeautServices}
                  className="flex items-center justify-center w-full bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-50 transition-all"
                >
                  Claim Offer <FaArrowRight className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;