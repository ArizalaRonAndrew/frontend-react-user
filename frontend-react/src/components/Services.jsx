import React, { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard"; // Adjust path if needed

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from Database
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/services");
                const data = await response.json();
                setServices(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading services...</div>;
    }

    return (
        <section id="services" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Our Services</h2>
                    <p className="text-gray-600">Photography services tailored for your moments</p>
                </div>

                {services.length === 0 ? (
                    <div className="text-center text-gray-500">No services available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id} 
                                serviceData={service} // Pass the FULL object from DB
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}