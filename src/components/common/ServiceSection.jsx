// components/ServicesSection.js
import { FaArrowRight } from "react-icons/fa";

const ServicesSection = ({ loading, error, categoryServices }) => {
  return (
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

        {loading ? (
          <div className="text-center py-10">
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>Error loading services: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryServices.map((service) => (
              <div
                key={service.name}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 h-[420px]"
              >
                {service.image.startsWith("data:image") ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <img
                    src={service.image || "/assets/default-service.jpg"}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-2xl font-bold text-white mb-3">
                    {service.name}
                  </h4>
                  <p className="text-gray-200 mb-5 text-lg">
                    {service.description}
                  </p>
                  <button className="text-pink-300 hover:text-white font-medium flex items-center text-lg">
                    Learn more <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;