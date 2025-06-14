// src/pages/reception/SpecialOffers.jsx
import { BiCalendarStar } from "react-icons/bi";
import { useState } from "react";

const SpecialOffers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Summer Glow Package",
      description: "Get a facial treatment + full body massage for 20% off! Perfect for summer skin care.",
      discount: "20% OFF",
      validUntil: "2023-08-31",
      active: true
    },
    {
      id: 2,
      title: "New Client Welcome",
      description: "First-time clients enjoy 15% off any service.",
      discount: "15% OFF",
      validUntil: "Ongoing",
      active: true
    },
    {
      id: 3,
      title: "Birthday Special",
      description: "Celebrate your birthday month with a free manicure when you book any facial treatment.",
      discount: "Free Manicure",
      validUntil: "2023-12-31",
      active: true
    }
  ]);

  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
    active: true
  });

  const handleAddOffer = (e) => {
    e.preventDefault();
    const offerToAdd = {
      ...newOffer,
      id: offers.length + 1
    };
    setOffers([...offers, offerToAdd]);
    setNewOffer({
      title: "",
      description: "",
      discount: "",
      validUntil: "",
      active: true
    });
  };

  const toggleOfferStatus = (id) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, active: !offer.active } : offer
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BiCalendarStar className="text-2xl text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">Special Offers</h1>
      </div>

      {/* Current Offers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className={`border rounded-lg overflow-hidden shadow-md ${offer.active ? 'border-pink-200' : 'border-gray-200 opacity-70'}`}>
              <div className="bg-pink-100 px-4 py-3 border-b border-pink-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-pink-800">{offer.title}</h3>
                  <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {offer.discount}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">{offer.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Valid until: {offer.validUntil}</span>
                  <button
                    onClick={() => toggleOfferStatus(offer.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${offer.active ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-pink-200 text-pink-700 hover:bg-pink-300'}`}
                  >
                    {offer.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add New Offer Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Offer</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleAddOffer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  type="text"
                  id="discount"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., 20% OFF, Free Service"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newOffer.description}
                onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="text"
                  id="validUntil"
                  value={newOffer.validUntil}
                  onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., 2023-12-31 or Ongoing"
                  required
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={newOffer.active}
                    onChange={(e) => setNewOffer({...newOffer, active: e.target.checked})}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Add Special Offer
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SpecialOffers;