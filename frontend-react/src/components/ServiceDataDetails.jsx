import { useParams, useNavigate } from "react-router-dom";
import servicesData from "../data/ServiceData";

export default function ServiceDataDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = servicesData[serviceId];

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Service Not Found</h2>
        <p className="text-gray-600 mt-4">
          Please go back and select a valid service.
        </p>
      </div>
    );
  }

  // Navigate to booking page with query params
  const handleBookNow = (pkgName) => {
    const url = `/booking?service=${serviceId}&package=${encodeURIComponent(pkgName)}`;
    navigate(url);
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/services");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {/* Back & Header */}
      <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-lg">
        <button
          onClick={handleGoBack}
          className="text-slate-600 hover:text-slate-800 transition block mb-4 text-sm font-medium"
        >
          ← Back to All Services
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          {service.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          {service.description}
        </p>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-2">Packages & Pricing</h2>

      {/* Package Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {service.packageInfo.map((pkg, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-t-4 border-slate-800 p-6 flex flex-col justify-between h-[420px] transition-shadow hover:shadow-2xl"
          >
            <div className="overflow-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h2>
              <p className="text-4xl font-extrabold text-slate-800 mb-4">{pkg.price}</p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                {pkg.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleBookNow(pkg.name)}
              className="mt-auto w-full block py-3 bg-slate-800 hover:bg-slate-900 text-white text-center font-bold rounded-lg transition-all shadow-md active:bg-slate-700"
            >
              Book This Now
            </button>
          </div>
        ))}
      </div>

      {/* Sample Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {service.sampleImages.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={img}
              alt={`${service.name} Sample ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
