import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Users,
  CheckCircle,
  Clock,
  Phone,
  Download,
  Trash2,
} from "lucide-react";
import Modal from "../../components/admin/Modal";
import {
  getAllStudents,
  updateStudentStatus,
  deleteStudent,
} from "../../services/StudentIdService";

const StudentIDList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getAllStudents();
    // Ensure we always have an array to prevent .filter() errors
    setStudents(Array.isArray(data) ? data : []);
  };

  const handleApprove = async (id) => {
    await updateStudentStatus(id, "Approved");
    fetchStudents();
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, status: "Approved" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this application?")) {
      await deleteStudent(id);
      fetchStudents();
      setSelectedStudent(null);
    }
  };

  const downloadImage = (base64String, name) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64String}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gradeLevels = ["All", "7", "8", "9", "10"];

  const filteredStudents = students.filter((student) => {
    const matchesGrade =
      selectedGrade === "All" ||
      student.grade === `Grade ${selectedGrade}` ||
      student.grade === selectedGrade;

    // SAFEGUARDS: Check if fields exist before calling toLowerCase()
    const firstName = student.first_name || "";
    const lastName = student.last_name || "";
    const studentId = student.student_id || "";

    const matchesSearch =
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.includes(searchTerm);

    return matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-6 h-full flex flex-col p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Student ID Applications
          </h2>
          <p className="text-slate-500 text-sm">
            Organized submissions by Grade Level.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or LRN..."
            className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 shrink-0">
        {gradeLevels.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedGrade === grade
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                : "bg-white text-slate-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {grade === "All" ? "View All" : `Grade ${grade}`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col grow">
        <div className="overflow-auto custom-scrollbar h-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 bg-slate-50">Student Name</th>
                <th className="px-6 py-4 bg-slate-50">LRN</th>
                <th className="px-6 py-4 bg-slate-50">Grade & Section</th>
                <th className="px-6 py-4 bg-slate-50">Status</th>
                <th className="px-6 py-4 text-center bg-slate-50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-indigo-50 transition cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {student.last_name}, {student.first_name}{" "}
                        {student.middle_name
                          ? student.middle_name[0] + "."
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-bold mr-2 bg-slate-100 text-slate-700">
                        {student.grade}
                      </span>
                      <span className="text-slate-600 text-sm font-medium">
                        {student.section}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* DB doesn't have status col yet, defaulting to Pending visual */}
                      <span className="px-2 py-1 text-xs font-bold rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 group-hover:text-indigo-600 transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-lg font-semibold">No students found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Application Details"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl flex items-center justify-between shadow-sm bg-amber-100 text-amber-800">
              <span className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Application Status:{" "}
                <span className="uppercase tracking-wide">PENDING Review</span>
              </span>
            </div>

            {/* Profile Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">
                  {selectedStudent.first_name
                    ? selectedStudent.first_name[0]
                    : "?"}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {selectedStudent.last_name}, {selectedStudent.first_name}{" "}
                    {selectedStudent.middle_name}.
                  </h4>
                  <p className="text-sm text-slate-500 font-mono">
                    LRN: {selectedStudent.student_id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Grade Level
                  </p>
                  <p className="font-semibold text-slate-700">
                    {selectedStudent.grade}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Section
                  </p>
                  <p className="font-semibold text-slate-700">
                    {selectedStudent.section}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Emergency Contact
              </p>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-700">
                    {selectedStudent.emergencyname}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedStudent.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-800">
                    {selectedStudent.emergencycontact}
                  </p>
                </div>
              </div>
            </div>

            {/* Images (Base64) */}
            <div className="grid grid-cols-2 gap-4">
              {/* ID Photo */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  ID Photo
                </span>
                <div className="p-1 border border-slate-100 rounded-lg bg-slate-50 mb-3 w-full h-32 flex items-center justify-center overflow-hidden">
                  {selectedStudent.photo_path ? (
                    <img
                      src={`data:image/png;base64,${selectedStudent.photo_path}`}
                      alt="ID"
                      className="h-full object-contain rounded-md"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Photo</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    selectedStudent.photo_path &&
                    downloadImage(
                      selectedStudent.photo_path,
                      "student-photo.png"
                    )
                  }
                  disabled={!selectedStudent.photo_path}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition flex justify-center items-center disabled:opacity-50"
                >
                  <Download className="w-3 h-3 mr-1" /> Download
                </button>
              </div>

              {/* Signature */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  Signature
                </span>
                <div className="w-full h-32 bg-white border border-slate-100 rounded-lg flex items-center justify-center mb-3 p-2 overflow-hidden">
                  {selectedStudent.signature_path ? (
                    <img
                      src={`data:image/png;base64,${selectedStudent.signature_path}`}
                      alt="Sig"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Signature</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    selectedStudent.signature_path &&
                    downloadImage(
                      selectedStudent.signature_path,
                      "student-sig.png"
                    )
                  }
                  disabled={!selectedStudent.signature_path}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition flex justify-center items-center disabled:opacity-50"
                >
                  <Download className="w-3 h-3 mr-1" /> Download
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleDelete(selectedStudent.id)}
                className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 flex items-center justify-center transition"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
              <button
                onClick={() => handleApprove(selectedStudent.id)}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200 transition"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve Application
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentIDList;
