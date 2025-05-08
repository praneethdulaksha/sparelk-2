import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShieldAlt, faTags, faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function WhyBuyFromUs() {
  const features = [
    {
      icon: faTruck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly and on time, every time.'
    },
    {
      icon: faShieldAlt,
      title: 'Secure Payments',
      description: 'Your transactions are safe with our top-notch security measures.'
    },
    {
      icon: faTags,
      title: 'Best Prices',
      description: 'We offer competitive prices without compromising on quality.'
    },
    {
      icon: faHeadset,
      title: '24/7 Support',
      description: 'Our support team is here to assist you anytime, day or night.'
    }
  ];

  return (
    <section className="bg-gray-100 py-10 w-screen">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Buy From Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-main text-4xl mb-4">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
