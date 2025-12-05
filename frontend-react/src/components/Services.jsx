import ServiceCard from "./ServiceCard";

export default function Services() {
    const services = [
        { key: "wedding", title: "Wedding Photography", image: "https://images.unsplash.com/photo-1758905728020-a888617aecd0", desc: "Complete coverage from preparation to reception" },
        { key: "debut", title: "Debut Photography", image: "https://images.unsplash.com/photo-1761331051932-c3fdd6c3e661", desc: "Elegant 18th birthday celebration coverage" },
        { key: "portrait", title: "Portrait Sessions", image: "https://images.unsplash.com/photo-1544124094-8aea0374da93", desc: "Professional studio and outdoor portraits" },
        { key: "events", title: "Special Events", image: "https://images.unsplash.com/photo-1758738180856-7538f9dd4ac4", desc: "Birthdays, anniversaries, corporate events" }
    ];

    return (
        <section id="services" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Our Services</h2>
                    <p className="text-gray-600">Photography services tailored for your moments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((s, i) => (
                        <ServiceCard
                            key={i} 
                            id={s.key} // use key as id for routing
                            title={s.title}
                            image={s.image}
                            desc={s.desc}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
