import axios from "axios";

// Ensure port matches your backend (5000 based on your previous files)
const BASE_URL = "http://localhost:5000/api/student-id";

// --- USER FUNCTIONS (Keep existing) ---
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

export async function submitStudentApplication(formData, photoDataURL, signatureDataURL) {
  const form = new FormData();
  form.append("lrn", formData.lrn);
  form.append("firstname", formData.firstname);
  form.append("middlename", formData.middlename);
  form.append("lastname", formData.lastname);
  form.append("phone", formData.phone);
  form.append("grade", formData.grade);
  form.append("section", formData.section);
  form.append("emName", formData.emName);
  form.append("emPhone", formData.emPhone);
  form.append("emAddress", formData.emAddress);

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
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, message: "Application failed." };
  }
}

/* --------------------------
   ADMIN-SIDE FUNCTIONS
--------------------------- */

export async function getAllStudents() {
    try {
        const response = await axios.get(BASE_URL);
        // Backend returns: { success: true, students: [...] }
        if (response.data && Array.isArray(response.data.students)) {
            return response.data.students;
        } 
        return [];
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}

export async function updateStudentStatus(id, status) {
    // Placeholder until status column is added to DB
    return { success: true };
}

export async function deleteStudent(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting student:", error);
        return null;
    }
}