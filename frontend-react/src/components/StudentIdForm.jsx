import { useState, useRef } from "react";
import PhotoUpload from "./PhotoUpload";
import SignatureCanvas from "./SignatureCanvas";
import { gradeData } from "../data/gradeData";
import { submitStudentApplication } from "../services/StudentIdService"; // <-- CRITICAL: Import for API submission

// Helper component for cleaner detail rendering (kept for modal context)
const DetailItem = ({ label, value, colorClass = "text-gray-900" }) => (
  <div className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-b-0">
    <span className="font-medium text-gray-500 text-sm md:text-base">
      {label}
    </span>
    <span
      className={`font-semibold text-right ${colorClass} text-sm md:text-base`}
    >
      {value || <span className="text-gray-400 italic">N/A</span>}
    </span>
  </div>
);

export default function StudentIdForm() {
  const [photoData, setPhotoData] = useState(null);
  const [signatureData, setSignatureData] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [sectionsOptions, setSectionsOptions] = useState([]);
  const [resetCounter, setResetCounter] = useState(0);

  // FORM INPUT VALUES
  const initialFormValues = {
    lrn: "",
    firstname: "",
    middlename: "",
    lastname: "",
    phone: "",
    emName: "",
    emPhone: "",
    emAddress: "",
  };
  const [formValues, setFormValues] = useState(initialFormValues);

  // FORM ERRORS / NOTES
  const [errors, setErrors] = useState({
    phone: "",
    emPhone: "",
  });

  // MODAL STATE (Kept for final confirmation)
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // <--- ADDED: Loading state for submission

  // === REFS FOR SCROLLING TO MISSING FIELDS ===
  const lrnRef = useRef(null); // Ref for LRN
  const gradeRef = useRef(null);
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const signatureRef = useRef(null);
  const formRef = useRef(null);

  // HANDLE CHANGE WITH DIGIT LIMIT FOR PHONE NUMBERS
  const handleChange = (name, value) => {
    // If the field is phone number
    if (name === "phone" || name === "emPhone") {
      value = value.replace(/\D/g, "");

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      setErrors((prev) => ({
        ...prev,
        [name]:
          value.length > 0 && value.length < 11
            ? "Number must be 11 digits"
            : "",
      }));
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (e) => {
    const selectedGrade = e.target.value;
    setGrade(selectedGrade);
    setSectionsOptions(selectedGrade ? gradeData[selectedGrade] : []);
    setSection("");
  };

  // RESET FORM
  const handleReset = () => {
    setPhotoData(null);
    setSignatureData("");
    setGrade("");
    setSection("");
    setSectionsOptions([]);
    setFormValues(initialFormValues);
    setErrors({ phone: "", emPhone: "" });
    setResetCounter((prev) => prev + 1);

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // === NEW VALIDATION AND SCROLL FUNCTION ===
  const handleReview = (e) => {
    e.preventDefault();

    // 1. Check native HTML required fields first
    if (formRef.current.checkValidity() === false) {
      // If native validation fails, the browser highlights the error and focuses the field.
      // We stop execution here.
      return;
    }

    // 2. Custom check for non-input/select fields and the LRN field
    let firstMissingRef = null;

    if (!formValues.lrn) {
      firstMissingRef = lrnRef;
    } else if (!grade) {
      firstMissingRef = gradeRef;
    } else if (!section) {
      firstMissingRef = sectionRef;
    } else if (!photoData) {
      firstMissingRef = photoRef;
    } else if (!signatureData) {
      firstMissingRef = signatureRef;
    } else if (errors.phone || errors.emPhone) {
      // If phone format errors exist, the browser may not catch them immediately.
      // We can manually scroll to the first phone error if necessary,
      // but for now, we just rely on the user seeing the red error message.
      return;
    }

    if (firstMissingRef) {
      // Scroll to the custom required field
      firstMissingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // The user will see the blank field after the scroll.
    } else {
      // 3. All checks passed: Open the confirmation modal
      setShowModal(true);
    }
  };

  // FINAL SUBMIT (FIXED API CALL)
  const handleFinalSubmit = async () => {
    // Map frontend state to backend model format
    const backendData = {
      lrn: formValues.lrn,
      firstname: formValues.firstname,
      middlename: formValues.middlename,
      lastname: formValues.lastname,
      phone: formValues.phone,
      grade: grade,
      section: section,

      // <--- FIXED: Ensure all emergency contact fields are passed
      emName: formValues.emName,
      emPhone: formValues.emPhone,
      emAddress: formValues.emAddress,
    };

    setLoading(true);

    // Call the new service function
    const result = await submitStudentApplication(
      backendData,
      photoData,
      signatureData
    );

    if (result.success) {
      // This relies on the backend sending back { id: <number> }
      alert("Application submitted successfully! ID: " + result.id);
      setShowModal(false);
      handleReset();
    } else {
      alert(result.message || "Failed to submit application.");
    }

    setLoading(false);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleReview}
        className="bg-white p-12 rounded-3xl shadow-2xl border border-indigo-100/50 space-y-10 max-w-4xl mx-auto"
      >
        {/* Personal Details */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">
            Personal Details
          </h3>
          <div ref={lrnRef} data-label="LRN">
            {" "}
            {/* Ref for LRN */}
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LRN (Learner Reference Number)
            </label>
            <input
              type="text"
              value={formValues.lrn}
              onChange={(e) => handleChange("lrn", e.target.value)}
              placeholder="e.g., 427904210003"
              // LRN is now required and checked in handleReview
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
            />
          </div>
        </section>

        {/* Name & Contact */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">
            Name & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formValues.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                required
                placeholder="Jarey"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Middle Name (Optional)
              </label>
              <input
                type="text"
                value={formValues.middlename}
                onChange={(e) => handleChange("middlename", e.target.value)}
                placeholder="Valencia"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formValues.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
                required
                placeholder="Bagunas"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formValues.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g., 0991 423 7456"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </section>

        {/* Academic Details */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">
            Academic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={gradeRef} data-label="Grade Level">
              {" "}
              {/* Ref for grade */}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                value={grade}
                onChange={handleGradeChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm bg-white cursor-pointer appearance-none pr-10 transition"
              >
                <option value="">Select grade level</option>
                {Object.keys(gradeData).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div ref={sectionRef} data-label="Section">
              {" "}
              {/* Ref for section */}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                disabled={!grade}
                className={`w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm appearance-none pr-10 transition ${
                  grade
                    ? "bg-white cursor-pointer text-gray-700 border-gray-300"
                    : "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200"
                }`}
              >
                <option value="">
                  {grade ? "Select section" : "Select grade first"}
                </option>
                {sectionsOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-red-600 border-b border-red-200 pb-2 mb-4">
            🚨 Emergency Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formValues.emName}
                onChange={(e) => handleChange("emName", e.target.value)}
                placeholder="Parent/Guardian Name"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formValues.emPhone}
                onChange={(e) => handleChange("emPhone", e.target.value)}
                placeholder="e.g., 0991 423 7456"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
              {errors.emPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.emPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formValues.emAddress}
                onChange={(e) => handleChange("emAddress", e.target.value)}
                placeholder="e.g., Biringan, Batangas"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              />
            </div>
          </div>
        </section>

        {/* Photo & Signature */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">
            Photo & Signature
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div ref={photoRef} data-label="ID Photo">
              {" "}
              {/* Ref for photo */}
              <PhotoUpload
                photoData={photoData}
                setPhotoData={setPhotoData}
                resetTrigger={resetCounter}
              />
            </div>
            <div ref={signatureRef} data-label="Signature">
              {" "}
              {/* Ref for signature */}
              <SignatureCanvas
                signatureData={signatureData}
                setSignatureData={setSignatureData}
                resetTrigger={resetCounter}
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <button
            type="submit"
            className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
          >
            🚀 Review & Submit Application
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

      {/* ================= CONFIRMATION MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div
            className="bg-white max-w-5xl w-full rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 transition-all 
            max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 border-b-4 border-indigo-100 pb-3">
              Confirmation of Application Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6 p-4 bg-indigo-50 rounded-xl shadow-inner border border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">
                  Media Review
                </h3>

                <div className="flex flex-col items-center">
                  <p className="font-bold text-gray-700 mb-2 text-lg">
                    ID Photo
                  </p>
                  <div className="w-44 h-44 bg-white border-2 border-indigo-400 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {photoData ? (
                      <img
                        src={photoData}
                        alt="Submitted ID Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No Photo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center pt-4 border-t border-indigo-100">
                  <p className="font-bold text-gray-700 mb-2 text-lg">
                    Signature
                  </p>
                  <div className="w-48 h-24 bg-white border border-gray-300 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {signatureData ? (
                      <img
                        src={signatureData}
                        alt="Submitted Signature"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No Signature
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <h3 className="text-2xl font-bold text-indigo-700 mb-3 border-b pb-1">
                    Academic & Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <div>
                      <h4 className="font-bold text-gray-600 mt-2 mb-2">
                        Academic Information
                      </h4>
                      <DetailItem label="Grade Level" value={grade} />
                      <DetailItem label="Section" value={section} />
                      <DetailItem label="LRN" value={formValues.lrn} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-600 mt-2 mb-2">
                        Contact Information
                      </h4>
                      <DetailItem
                        label="First Name"
                        value={formValues.firstname}
                      />
                      <DetailItem
                        label="Middle Name"
                        value={formValues.middlename}
                      />
                      <DetailItem
                        label="Last Name"
                        value={formValues.lastname}
                      />
                      <DetailItem
                        label="Phone Number"
                        value={formValues.phone}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-red-300 rounded-xl bg-red-50 shadow-sm">
                  <h3 className="text-2xl font-bold text-red-700 mb-3 border-b border-red-200 pb-1">
                    🚨 Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                    <DetailItem
                      label="Contact Name"
                      value={formValues.emName}
                      colorClass="text-red-900"
                    />
                    <DetailItem
                      label="Contact Phone"
                      value={formValues.emPhone}
                      colorClass="text-red-900"
                    />
                    <DetailItem
                      label="Address"
                      value={formValues.emAddress}
                      colorClass="text-red-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL BUTTONS */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition shadow"
              >
                ✏️ Edit Information
              </button>

              <button
                onClick={handleFinalSubmit}
                className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-800 transition transform hover:scale-[1.01]"
                disabled={loading} // <--- MODIFIED
              >
                {loading ? "Submitting..." : "✔ Confirm & Submit"}{" "}
                {/* <--- MODIFIED */}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
