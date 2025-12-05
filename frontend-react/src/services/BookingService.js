// src/utils/bookingLogic.js
import axios from "axios";

/* --------------------------
   SERVICE + PACKAGE DATA
--------------------------- */
export const SERVICE_PACKAGES = {
    wedding: ["Silver Package", "Gold Package"],
    debut: ["Basic Debut", "Premium Debut"],
    portrait: ["Standard Session", "Premium Session"],
    events: ["Basic Event", "Extended Event"],
    birthday: ["Kids Package", "Teen Package", "Family Birthday Package"],
    corporate: ["Corporate Basic", "Corporate Plus", "Corporate Premium"],
    other: ["General Package A", "General Package B"]
};

/* --------------------------
   GET PACKAGES FOR SERVICE
--------------------------- */
export function getPackages(service) {
    return SERVICE_PACKAGES[service] || [];
}

/* --------------------------
   SUBMIT FORM USING AXIOS
--------------------------- */
export async function submitBooking(formData) {
    try {
        const res = await axios.post("http://localhost:5000/api/bookings", formData);
        return res.data;
    } catch (error) {
        return { success: false, error };
    }
}

/* --------------------------
   GET SERVICE & PACKAGE FROM URL
--------------------------- */
export function readQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        service: params.get("service"),
        package: params.get("package")
    };
}
