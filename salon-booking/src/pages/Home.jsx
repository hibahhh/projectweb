import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#3A2F2F] mb-6">
                        Your Beauty
                        <br />
                        <span className="text-[#C98C8C]">
                            Starts Here
                        </span>
                    </h1>
                    <p className="text-xl text-[#7A6E6E] leading-relaxed mb-8 max-w-2xl mx-auto">
                        Experience luxury beauty services in a serene, professional environment.
                        Book your appointment today and discover elegance redefined.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/booking" className="btn-primary text-lg">
                            Book Appointment
                        </Link>
                        <Link to="/services" className="btn-secondary text-lg">
                            View Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-[#F1E6E2]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-[#3A2F2F]">
                        Why Choose BookMySalon?
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
                <div className="max-w-4xl mx-auto text-center card bg-[#C98C8C] text-white border-none">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Look Your Best?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of satisfied customers who trust us with their beauty needs.
                    </p>
                    <Link to="/booking" className="inline-block bg-white text-[#C98C8C] px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200">
                        Book Your Appointment Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="card text-center group hover:shadow-lg transition-all duration-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-[#3A2F2F]">{title}</h3>
            <p className="text-[#7A6E6E] leading-relaxed">{description}</p>
        </div>
    );
}

export default Home;
