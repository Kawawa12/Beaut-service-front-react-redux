import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCut, FaBrush, FaSmile, FaLeaf, FaAward } from "react-icons/fa";
import { GiLipstick } from "react-icons/gi";
import Header from "./Header";
import Footer from "./Footer";

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Placeholder images (replace with actual assets or API URLs)
  const salonInterior =
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f";
  const teamImage =
    "https://images.unsplash.com/photo-1521737604890-62d6c61a4b75";

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
        !e.target.closest('button[aria-label="Toggle Menu"]')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white pt-20">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        mobileMenuRef={mobileMenuRef}
        profileDropdownRef={profileDropdownRef}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-600 to-purple-500 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Our Beauty Haven
          </h1>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto">
            Where beauty meets passion, and every woman leaves feeling like the
            best version of herself.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <img
              src={salonInterior}
              alt="Salon Interior"
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2015,{" "}
              <span className="font-semibold text-pink-600">BeautifyHer</span>{" "}
              began as a small studio with a big dream - to revolutionize the
              beauty experience for women.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a single-chair salon has blossomed into a premier
              beauty destination, known for our exceptional services and warm,
              welcoming atmosphere.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve over 1,000 clients monthly, helping
              each one discover their unique beauty.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Our Beauty Philosophy
            </h2>
            <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
              <div className="text-pink-500 text-4xl mb-4 flex justify-center">
                <FaSmile />
              </div>
              <h3 className="text-xl font-semibold mb-3">Confidence First</h3>
              <p className="text-gray-600">
                We believe beauty starts from within. Our services are designed
                to enhance your natural features and boost your confidence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
              <div className="text-pink-500 text-4xl mb-4 flex justify-center">
                <FaLeaf />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clean Beauty</h3>
              <p className="text-gray-600">
                We use only premium, cruelty-free products that nourish your
                skin and hair while delivering stunning results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition duration-300">
              <div className="text-pink-500 text-4xl mb-4 flex justify-center">
                <FaAward />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Care</h3>
              <p className="text-gray-600">
                Our team undergoes rigorous training to stay at the forefront of
                beauty trends and techniques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Meet Our Beauty Artists
          </h2>
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div className="lg:w-1/2">
            <img
              src={teamImage}
              alt="Our Team"
              className="rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
          <div className="lg:w-1/2">
            <p className="text-gray-600 mb-6">
              Our team of certified beauty professionals brings together decades
              of combined experience and a shared passion for making women feel
              extraordinary.
            </p>
            <p className="text-gray-600 mb-6">
              Each specialist undergoes continuous education to master the
              latest techniques in haircare, skincare, and beauty treatments.
            </p>
            <p className="text-gray-600">
              We're not just service providers - we're beauty consultants
              dedicated to helping you look and feel your absolute best.
            </p>
          </div>
        </div>

        {/* Services Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <div className="text-pink-500 mr-4 text-2xl">
                <FaCut />
              </div>
              <h3 className="text-lg font-semibold">Hair Services</h3>
            </div>
            <p className="text-gray-600">
              From precision cuts to vibrant coloring and luxurious treatments,
              we transform your hair into your best accessory.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <div className="text-pink-500 mr-4 text-2xl">
                <GiLipstick />
              </div>
              <h3 className="text-lg font-semibold">Makeup Artistry</h3>
            </div>
            <p className="text-gray-600">
              Whether it's a natural daytime look or glamorous evening
              transformation, our makeup artists enhance your unique beauty.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <div className="text-pink-500 mr-4 text-2xl">
                <FaBrush />
              </div>
              <h3 className="text-lg font-semibold">Skincare Treatments</h3>
            </div>
            <p className="text-gray-600">
              Our facial treatments and skincare solutions are customized to
              your skin's needs for a radiant, healthy glow.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the BeautifyHer Difference?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Book your appointment today and discover why women trust us with
            their beauty needs.
          </p>
          <Link
            to="/services"
            className="bg-white text-pink-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg inline-block w-full sm:w-auto"
          >
            Book Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
