import { useEffect, useState } from "react";
import { getPackages, submitBooking, readQueryParams } from "../services/BookingService";

// Helper component for cleaner detail rendering in the modal
const DetailItem = ({ label, value, isPrimary = false }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
    <span className={`font-medium text-gray-500 ${isPrimary ? "text-lg text-indigo-700" : "text-base"}`}>{label}</span>
    <span className={`font-semibold text-right ${isPrimary ? "text-indigo-900 text-lg" : "text-gray-900 text-base"}`}>
      {value || <span className="text-gray-400 italic">N/A</span>}
    </span>
  </div>
);

export default function BookingForm() {
  const initialFormData = {
    fullname: "",
    email: "",
    phonenumber: "",
    location: "",
    category: "",
    Package_type: "",
    date: "",
    time: "",
    details: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [packageOptions, setPackageOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // AUTO-FILL when arriving from service-details.html
  useEffect(() => {
    const { service, package: pkg } = readQueryParams();

    if (service) {
      handleChange({ target: { name: "category", value: service } });

      const packages = getPackages(service);
      setPackageOptions(packages);

      if (pkg) {
        setFormData((prev) => ({ ...prev, Package_type: pkg }));
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit phone number to 11 digits numeric only
    if (name === "phonenumber") {
      let numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 11) numericValue = numericValue.slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      const pkgList = getPackages(value);
      setPackageOptions(pkgList);
      setFormData((prev) => ({ ...prev, Package_type: "" }));
    }
  };

  // Reset form
  const handleReset = () => {
    setPackageOptions([]);
    setFormData(initialFormData);
  };

  // Open review modal
  const openReviewModal = (e) => {
    e.preventDefault();
    // Optional: prevent opening modal if phone is invalid
    if (formData.phonenumber.length !== 11) {
      alert("Please enter a valid 11-digit phone number.");
      return;
    }
    setShowModal(true);
  };

  // Submit booking
  const handleSubmit = async () => {
    setLoading(true);

    const result = await submitBooking(formData);

    if (result.success) {
      alert("Booking submitted successfully!");
      handleReset();
      setShowModal(false);
    } else {
      alert("Failed to submit booking.");
    }

    setLoading(false);
  };

  return (
    <>
      <section className="py-24 bg-linear-to-br from-indigo-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
              📸 Book Your Session
            </h2>
            <p className="text-gray-600 text-lg">
              Fill out the form and we’ll confirm within 24 hours.
            </p>
          </div>

          <form
            onSubmit={openReviewModal}
            className="bg-white shadow-2xl rounded-3xl p-12 space-y-10 border border-gray-200"
          >
            {/* PERSONAL DETAILS */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Personal Details
              </h3>

              <div>
                <label className="block text-md font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    type="tel"
                    placeholder="09123456789"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                  />
                  {formData.phonenumber.length > 0 && formData.phonenumber.length < 11 && (
                    <p className="text-red-500 text-sm mt-1">
                      Phone number must be 11 digits
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-md font-semibold text-gray-700 mb-2">
                  Event Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  type="text"
                  placeholder="Venue or Address"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                />
              </div>
            </div>

            {/* SERVICE INFO */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Service Info
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white shadow-sm transition"
                  >
                    <option value="">Select a service</option>
                    <option value="wedding">Wedding Photography</option>
                    <option value="debut">Debut Photography</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="events">Special Events</option>
                    <option value="birthday">Birthday Event</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Package Type *
                  </label>
                  <select
                    name="Package_type"
                    value={formData.Package_type}
                    onChange={handleChange}
                    required={!!formData.category}
                    disabled={!formData.category}
                    className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition ${
                      formData.category
                        ? "bg-white text-gray-900 border-gray-300"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    <option value="">
                      {formData.category ? "Select a package" : "Select service first"}
                    </option>
                    {packageOptions.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SCHEDULE */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    type="date"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <input
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    type="time"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>
              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Additional Notes
              </h3>

              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="5"
                placeholder="Additional notes or requests..."
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="submit"
                className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                🚀 Review & Submit
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-200 transition-all"
              >
                ❌ Reset Form
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 transition-all max-h-[90vh] overflow-y-auto"> 
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 border-b-4 border-indigo-100 pb-3">
              Review & Confirm Your Booking
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 shadow-sm">
                <h3 className="text-2xl font-bold text-indigo-700 mb-3 border-b pb-1">Client Details 👤</h3>
                <DetailItem label="Full Name" value={formData.fullname} />
                <DetailItem label="Email" value={formData.email} />
                <DetailItem label="Phone Number" value={formData.phonenumber} />
                <DetailItem label="Location" value={formData.location} />
              </div>

              <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 shadow-sm">
                <h3 className="text-2xl font-bold text-indigo-700 mb-3 border-b pb-1">Booking Info 📅</h3>
                <DetailItem label="Service Type" value={formData.category} isPrimary={true}/>
                <DetailItem label="Package Type" value={formData.Package_type} isPrimary={true}/>
                <DetailItem label="Preferred Date" value={formData.date} />
                <DetailItem label="Preferred Time" value={formData.time} />
              </div>
            </div>

            <div className="mt-8 p-4 border border-gray-200 rounded-xl bg-white shadow-md">
              <h3 className="text-2xl font-bold text-gray-700 mb-3 border-b pb-1">Additional Notes 📝</h3>
              <p className="whitespace-pre-line text-gray-700 px-2 py-2 min-h-[60px] italic">
                {formData.details || "No additional notes were provided for this booking."}
              </p>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition shadow"
              >
                ✏️ Go Back & Edit
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-800 transition transform hover:scale-[1.01]"
                disabled={loading}
              >
                {loading ? "Submitting..." : "✔ Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

