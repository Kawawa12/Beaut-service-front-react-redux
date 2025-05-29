// components/AboutOurServices.js
const AboutOurServices = () => {
  return (
    <section className="py-24 px-6 bg-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-pink-600 mb-4 font-serif">
            About Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the excellence behind our beauty treatments and what makes
            us different.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">
                Our Philosophy
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                At the heart of our salon is a belief that every woman and girl
                deserves to feel confident, radiant, and celebrated. Our
                philosophy blends timeless beauty rituals with modern techniques
                to enhance your natural glow in a warm, nurturing environment.
                Whether it's a moment of self-care or a special occasion, we’re
                here to make you feel beautiful, empowered, and pampered.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">
                Special Offers
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                We love to pamper our guests with more than just treatments.
                Explore exclusive offers designed to make your experience even
                more rewarding.
              </p>
              <ul className="space-y-3 text-gray-700 text-lg">
                {[
                  "💖 15% off your first beauty treatment",
                  "🎀 Join our loyalty program for free pamper points & rewards",
                  "🌸 Monthly glow-up membership packages with VIP perks",
                  "🎁 Elegant gift cards – perfect for birthdays & bridal treats",
                  "👭 Refer a friend and both of you enjoy exclusive discounts",
                ].map((offer, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-pink-500 text-xl mr-3">✦</span>
                    <span>{offer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Our Space",
                text: "Relax in our luxurious, hygienic environment designed for your comfort.",
                image: "/assets/beaut_saloon.jpg",
              },
              {
                title: "Premium Products",
                text: "We use only the highest quality, cruelty-free products.",
                image: "/assets/beaut_product.jpg",
              },
              {
                title: "Expert Team",
                text: "Certified professionals with years of experience.",
                image: "/assets/expert_team.jpg",
              },
              {
                title: "Client Satisfaction",
                text: "98% of our clients report excellent results.",
                image: "/assets/happy_client1.jpg",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="text-lg font-semibold text-pink-600 mb-1">
                  {card.title}
                </h4>
                <p className="text-gray-600 text-sm">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOurServices;
