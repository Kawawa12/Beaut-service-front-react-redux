import { useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/category-slice";
import { Link } from "react-router-dom";
import QuickLinks from "./QuickLink";
  
function Footer() {
  const { loading, categories, error } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const services = categories.map((category) => ({
    name: category.name,
    slug: category.name.toLowerCase().replace(/\s+/g, '-'), // Slugify category name
  }));

  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Beauté Branding */}
          <div>
            <h4 className="text-2xl font-bold text-pink-400 mb-4 font-serif">
              Beauté
            </h4>
            <p className="text-gray-400 mb-4">
              Your premier destination for luxury beauty treatments and
              personalized care.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: FaInstagram, url: "https://instagram.com" },
                { Icon: FaFacebook, url: "https://facebook.com" },
                { Icon: FaTwitter, url: "https://twitter.com" },
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Services */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Services</h5>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-gray-400 hover:text-pink-400 transition"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
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
  );
}

export default Footer;