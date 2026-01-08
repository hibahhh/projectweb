import { useState, useEffect } from 'react';

function Services() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ['All', ...new Set(services.map(s => s.category))];

    const filteredServices = selectedCategory === 'All'
        ? services
        : services.filter(s => s.category === selectedCategory);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading services...</p>
                </div>
            </div>
        );
    }

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

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No services available in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ServiceCard({ service }) {
    return (
        <div className="card group hover:scale-105 transition-all duration-300">
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {service.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3">
                    {service.category}
                </span>
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
