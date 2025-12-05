import React, { useState, useEffect } from "react";
import { DollarSign, Briefcase, Users } from "lucide-react";
import { getAllBookings } from "../../services/BookingService";
import { getAllStudents } from "../../services/StudentIdService";

const Reports = () => {
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const [bData, sData] = await Promise.all([
        getAllBookings(),
        getAllStudents(),
      ]);
      setBookings(bData || []);
      setStudents(sData || []);
    };
    fetchData();
  }, []);

  const isDateInCurrentPeriod = (dateString) => {
    if (filterType === "All") return true;
    const date = new Date(dateString);
    const now = new Date();
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterType === "Daily") return date.getTime() === today.getTime();
    if (filterType === "Weekly") {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }
    if (filterType === "Monthly")
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    if (filterType === "Yearly")
      return date.getFullYear() === now.getFullYear();
    return true;
  };

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed" && isDateInCurrentPeriod(b.date)
  );
  const approvedIDs = students.filter(
    (s) => s.status === "Approved" && isDateInCurrentPeriod(s.dateSubmitted)
  ); // dateSubmitted might need to be added to backend or derived from createdAt
  const totalRevenue = completedBookings.length * 5000;
  const filters = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="space-y-8 h-full overflow-y-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">System Reports</h2>
        <div className="bg-white p-1 rounded-lg border border-slate-200 flex gap-1 mt-4 md:mt-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition ${
                filterType === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-emerald-600 p-6 rounded-xl shadow-lg text-white flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
              Total Realized Revenue
            </p>
            <span className="bg-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/50 uppercase">
              {filterType}
            </span>
          </div>
          <h3 className="text-4xl font-bold">
            ₱{totalRevenue.toLocaleString()}
          </h3>
          <p className="text-emerald-200 text-xs mt-2">
            Calculated from {completedBookings.length} completed bookings
          </p>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-sky-600" /> Completed
              Bookings
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
              {completedBookings.length} Done
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-white text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedBookings.length > 0 ? (
                  completedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-slate-700">
                          {b.fullname}
                        </div>
                        <div className="text-xs text-slate-500">
                          {b.category}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {b.date}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 italic truncate max-w-[150px]">
                        {b.package}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-slate-400 text-sm italic"
                    >
                      No completed bookings found for{" "}
                      <span className="font-bold">{filterType}</span> filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" /> Approved ID
              Submissions
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
              {approvedIDs.length} Approved
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-white text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Section</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedIDs.length > 0 ? (
                  approvedIDs.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-slate-700">
                          {s.lastname}, {s.firstname}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">
                        {s.dateSubmitted || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {s.grade} - {s.section}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-slate-400 text-sm italic"
                    >
                      No approved IDs found for{" "}
                      <span className="font-bold">{filterType}</span> filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
