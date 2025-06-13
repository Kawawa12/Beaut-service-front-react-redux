import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import Footer from './Footer';
import Header from './Header';

const EventContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      setSubmitMessage('Thank you for your event inquiry! We’ll contact you soon to plan your special occasion.');
      setFormData({ name: '', email: '', phone: '', eventType: '', eventDate: '', guests: '', message: '' });
    } catch (error) {
      setSubmitMessage('Oops, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('event-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        mobileMenuRef={mobileMenuRef}
        profileDropdownRef={profileDropdownRef}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 animate-fadeIn">
            Plan Your Special Event with Beauté Services
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 animate-fadeIn delay-200">
            From bridal parties to birthdays, we make every occasion glamorous. Contact us to create unforgettable beauty experiences.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-block px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-pink-100 transition transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white clip-path-wave"></div>
      </section>

      {/* Event Contact Section */}
     <section id="event-form" className="py-16">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Event Contact Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif text-pink-600 mb-6">Event Inquiry Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="123-456-7890"
            />
          </div>

          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select an event type</option>
              <option value="Bridal Party">Bridal Party</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
              Preferred Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Additional Details
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="Tell us about your event..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
          </button>

          {submitMessage && (
            <p className={`text-center ${submitMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
              {submitMessage}
            </p>
          )}
        </form>
      </div>

      {/* Event Contact Info */}
      <div className="space-y-8">
        <h2 className="text-3xl font-serif text-pink-600 mb-6">Event Contact Details</h2>

        <div className="flex items-start space-x-4">
          <FaPhone className="text-pink-600 text-2xl mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Event Coordinator</h3>
            <p className="text-gray-600">+1 (123) 456-7890</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <FaEnvelope className="text-pink-600 text-2xl mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="text-gray-600">events@beauteservices.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <FaMapMarkerAlt className="text-pink-600 text-2xl mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
            <p className="text-gray-600">123 Beauty Lane, Suite 100, Glamour City, GC 12345</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Connect with Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition"
            >
              <FaTwitter className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </div> {/* End grid */}
  </div>   {/* End container */}
</section> {/* End section */}


        {/* Event Gallery Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-pink-600 mb-6 text-center">Our Event Transformations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: 'assets/part.jpg', alt: 'Bridal Party' },
                { src: 'assets/birthday_cel.jpg', alt: 'Birthday Celebration' },
                { src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce', alt: 'Corporate Event' },
              ].map((image, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden shadow-lg group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <p className="text-white font-semibold text-lg">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
      
  );
};

export default EventContact;