import axios from "axios";

const BASE_URL = "http://localhost:5000/api/student-id";

// Helper function to convert base64 data URL to Blob/File object
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function submitStudentApplication(
  formData,
  photoDataURL,
  signatureDataURL
) {
  const form = new FormData();

  // Map all collected form data directly to FormData
  form.append("lrn", formData.lrn);
  form.append("firstname", formData.firstname);
  form.append("middlename", formData.middlename);
  form.append("lastname", formData.lastname);
  form.append("phone", formData.phone);
  form.append("grade", formData.grade);
  form.append("section", formData.section);

  // Emergency Contact Fields
  form.append("emName", formData.emName);
  form.append("emPhone", formData.emPhone);
  form.append("emAddress", formData.emAddress);

  // Convert Base64 data to Blob and append as 'photo' and 'signature' files
  if (photoDataURL) {
    const photoBlob = dataURLtoFile(photoDataURL, "photo.png");
    form.append("photo", photoBlob, "photo.png");
  }
  if (signatureDataURL) {
    const signatureBlob = dataURLtoFile(signatureDataURL, "signature.png");
    form.append("signature", signatureBlob, "signature.png");
  }

  try {
    const response = await axios.post(BASE_URL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Submission error:", error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || "Application failed.",
    };
  }
}
