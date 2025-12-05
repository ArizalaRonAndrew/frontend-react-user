import { Link } from "react-router-dom";
import servicesData from "../data/ServiceData";

export default function ServiceCard({ id }) {
    // Get the service info from servicesData
    const service = servicesData[id];

    if (!service) return null; 



    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
            <div className="h-48 w-full overflow-hidden">
                <img
                    src={service.sampleImages[0]} 
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="p-6 flex flex-col grow">
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 grow">{service.description}</p>

                <div className="flex justify-center">
                    <Link
                        to={`/service/${id}`}
                        className="mt-4 w-full block py-2 bg-slate-800 hover:bg-slate-900 text-white text-center font-medium rounded-lg transition-all shadow-md"
                    >
                        View Packages
                    </Link>
                </div>
            </div>
        </div>
    );
}
