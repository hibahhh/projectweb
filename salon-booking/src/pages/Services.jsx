import { useState } from 'react';

const SERVICES = [
    {
        id: 1,
        name: 'Hair Styling',
        description: 'Professional haircuts, styling, and treatments for all hair types',
        price: '$50 - $150',
        duration: '60-90 min',
        icon: '💇‍♀️',
        category: 'Hair'
    },
    {
        id: 2,
        name: 'Hair Coloring',
        description: 'Full color, highlights, balayage, and color correction services',
        price: '$80 - $250',
        duration: '120-180 min',
        icon: '🎨',
        category: 'Hair'
    },
    {
        id: 3,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care with polish, gel, or acrylic options',
        price: '$30 - $80',
        duration: '45-60 min',
        icon: '💅',
        category: 'Nails'
    },
    {
        id: 4,
        name: 'Facial Treatment',
        description: 'Deep cleansing, anti-aging, and hydrating facial treatments',
        price: '$60 - $120',
        duration: '60 min',
        icon: '✨',
        category: 'Skincare'
    },
    {
        id: 5,
        name: 'Massage Therapy',
        description: 'Relaxing full-body massage to relieve stress and tension',
        price: '$70 - $140',
        duration: '60-90 min',
        icon: '💆‍♀️',
        category: 'Wellness'
    },
    {
        id: 6,
        name: 'Makeup Services',
        description: 'Professional makeup for special occasions and events',
        price: '$50 - $200',
        duration: '45-90 min',
        icon: '💄',
        category: 'Makeup'
    },
    {
        id: 7,
        name: 'Waxing',
        description: 'Professional hair removal services for smooth skin',
        price: '$20 - $100',
        duration: '15-60 min',
        icon: '🌟',
        category: 'Skincare'
    },
    {
        id: 8,
        name: 'Bridal Package',
        description: 'Complete bridal beauty package including hair, makeup, and nails',
        price: '$300 - $600',
        duration: '3-4 hours',
        icon: '👰',
        category: 'Special'
    }
];

function Services() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(SERVICES.map(s => s.category))];

    const filteredServices = selectedCategory === 'All'
        ? SERVICES
        : SERVICES.filter(s => s.category === selectedCategory);

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                            Our Services
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our comprehensive range of beauty and wellness services,
                        tailored to make you look and feel your absolute best.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-primary-600 to-pink-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ServiceCard({ service }) {
    return (
        <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex items-start space-x-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {service.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3">
                        {service.category}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-primary-600">{service.price}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-gray-700">{service.duration}</p>
                </div>
            </div>

            <button className="w-full mt-4 btn-primary">
                Book This Service
            </button>
        </div>
    );
}

export default Services;
export { SERVICES };
