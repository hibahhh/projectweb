import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

function ManageServices() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchServices();
    }, [user, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingService
                ? `http://localhost:3001/api/services/${editingService.id}`
                : 'http://localhost:3001/api/services';

            const method = editingService ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(editingService ? 'Service updated successfully!' : 'Service added successfully!');
                setShowForm(false);
                resetForm();
                fetchServices();
            } else {
                alert(data.message || 'Failed to save service');
            }
        } catch (error) {
            alert('Error saving service');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category
        });
        setShowForm(true);
    };

    const handleDelete = async (serviceId) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/services/${serviceId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Service deleted successfully');
                fetchServices();
            }
        } catch (error) {
            alert('Error deleting service');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: '',
            category: ''
        });
        setEditingService(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        resetForm();
    };

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
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800 mb-2">Manage Services</h1>
                        <p className="text-stone-600">Add, edit, or remove salon services</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add New Service'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="card mb-8">
                        <h2 className="text-2xl font-bold text-stone-800 mb-6">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Service Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Hair Styling"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Category *</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Hair, Nails, Skincare"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows="3"
                                    placeholder="Describe the service..."
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Price Range *</label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., $50 - $150"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Duration *</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., 60-90 min"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="btn-primary">
                                    {editingService ? 'Update Service' : 'Add Service'}
                                </button>
                                <button type="button" onClick={handleCancel} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="card hover:shadow-xl transition-shadow">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-stone-800">{service.name}</h3>
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                                        {service.category}
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm mb-3">{service.description}</p>
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary-600 font-semibold">{service.price}</span>
                                    <span className="text-stone-500">⏱ {service.duration}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-stone-200">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">💇‍♀️</div>
                        <p className="text-stone-600 text-lg mb-4">No services added yet</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            Add Your First Service
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageServices;
