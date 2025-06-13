import React from 'react'
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  return (
    <div>
      <h5 className="text-lg font-semibold mb-4 text-white">Quick Links</h5>
      <ul className="space-y-2">
        {[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'About Us', path: '/about-us' },
          { name: 'Contact', path: '/contact' },
          { name: 'Event Contact', path: '/event-contact' },
        ].map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className="text-gray-400 hover:text-pink-400 transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickLinks