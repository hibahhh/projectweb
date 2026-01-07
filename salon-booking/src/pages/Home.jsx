import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in">
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                                    Transform Your Look
                                </span>
                                <br />
                                <span className="text-gray-800">
                                    At Glamour Salon
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Experience luxury beauty services with our expert stylists.
                                Book your appointment today and discover the new you.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/booking" className="btn-primary text-lg">
                                    Book Appointment
                                </Link>
                                <Link to="/services" className="btn-secondary text-lg">
                                    View Services
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-pink-400 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-8xl mb-4">💇‍♀️</div>
                                    <p className="text-2xl font-semibold">Your Beauty Journey Starts Here</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-50"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-400 rounded-full blur-2xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Why Choose Us?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="⭐"
                            title="Expert Stylists"
                            description="Our team of certified professionals brings years of experience and passion to every service."
                        />
                        <FeatureCard
                            icon="🎨"
                            title="Premium Products"
                            description="We use only the finest, salon-grade products to ensure stunning and lasting results."
                        />
                        <FeatureCard
                            icon="📅"
                            title="Easy Booking"
                            description="Book your appointments online anytime, anywhere with our simple booking system."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center card bg-gradient-to-r from-primary-600 to-pink-600 text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Look Your Best?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of satisfied customers who trust us with their beauty needs.
                    </p>
                    <Link to="/booking" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                        Book Your Appointment Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

export default Home;
