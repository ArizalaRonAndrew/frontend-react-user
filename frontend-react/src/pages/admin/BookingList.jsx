import React, { useState, useEffect } from "react";
import { 
  Search, Eye, Calendar, CheckCircle, XCircle, Clock, Trash2, MapPin, Package, User, Phone, Mail, CheckSquare, AlertTriangle, ChevronRight, AlertCircle 
} from "lucide-react";
import Modal from "../../components/admin/Modal"; 
import { getAllBookings, updateBookingStatus, deleteBooking } from "../../services/BookingService";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getAllBookings();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Completed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Mark this booking as ${newStatus}?`)) return;

    const result = await updateBookingStatus(id, newStatus);
    if (result && result.success) {
      fetchBookings();
      if (selectedBooking && selectedBooking.userID === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } else {
      alert("Failed to update status. Check backend.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;

    const result = await deleteBooking(id);
    if (result && result.success) {
      fetchBookings();
      setSelectedBooking(null);
    } else {
      alert("Failed to delete booking.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const name = booking.fullname || "";
    const idStr = booking.userID ? booking.userID.toString() : "";
    const status = booking.status || "Pending";
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || idStr.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  // --- DATE & URGENCY LOGIC ---
  const normalizeDate = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayObj = new Date();
  const tomorrowObj = new Date(todayObj);
  tomorrowObj.setDate(todayObj.getDate() + 1);

  const todayKey = normalizeDate(todayObj);
  const tomorrowKey = normalizeDate(tomorrowObj);

  const bookingToday = bookings.find(
    (b) => b.status === "Confirmed" && normalizeDate(b.date) === todayKey
  );

  const bookingTomorrow = bookings.find(
    (b) => b.status === "Confirmed" && normalizeDate(b.date) === tomorrowKey
  );
  // --------------------------------

  return (
    <div className="space-y-6 h-full flex flex-col p-4 lg:p-8">
      
      {/* --- RED BANNER (TODAY) --- */}
      {bookingToday && (
        <div 
          onClick={() => setSelectedBooking(bookingToday)} 
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm cursor-pointer hover:bg-red-100 transition group shrink-0"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h4 className="font-bold text-red-800 group-hover:underline">Action Required: Event TODAY!</h4>
              <p className="text-sm text-red-700 mt-1">
                You have a confirmed event scheduled for <b>Today</b> with {bookingToday.fullname}.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition" />
          </div>
        </div>
      )}

      {/* --- ORANGE BANNER (TOMORROW) --- */}
      {bookingTomorrow && (
        <div 
          onClick={() => setSelectedBooking(bookingTomorrow)} 
          className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm cursor-pointer hover:bg-orange-100 transition group shrink-0"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-orange-800 group-hover:underline">Upcoming: Event Tomorrow</h4>
              <p className="text-sm text-orange-700 mt-1">
                Prepare for tomorrow's booking with <b>{bookingTomorrow.fullname}</b>.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition" />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
          <p className="text-slate-500 text-sm">Manage studio and event bookings.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search client or ID..."
            className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 shrink-0">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              statusFilter === status
                ? "bg-slate-800 text-white border-slate-800 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col grow">
        <div className="overflow-auto custom-scrollbar h-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Package & Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading bookings...</td></tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.userID} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{booking.fullname}</div>
                      <div className="text-xs text-slate-500">ID: #{booking.userID}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Package className="w-3 h-3 text-indigo-500" />
                        {booking.category} - {booking.details}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()} {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status || "Pending")}`}>
                        {booking.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setSelectedBooking(booking)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"><Eye className="w-4 h-4" /></button>
                        
                        {(booking.status || "Pending") === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(booking.userID, 'Confirmed')} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleStatusUpdate(booking.userID, 'Cancelled')} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}

                        {booking.status === 'Confirmed' && (
                            <button onClick={() => handleStatusUpdate(booking.userID, 'Completed')} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Mark as Completed"><CheckSquare className="w-4 h-4" /></button>
                        )}
                        
                        {/* --- NEW CODE: ADDED DELETE BUTTON FOR COMPLETED --- */}
                        {booking.status === 'Completed' && (
                          <button onClick={() => handleDelete(booking.userID)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete Completed"><Trash2 className="w-4 h-4" /></button>
                        )}

                        {booking.status === 'Cancelled' && (
                          <button onClick={() => handleDelete(booking.userID)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400"><p>No bookings found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Booking Details">
        {selectedBooking && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm ${getStatusColor(selectedBooking.status || "Pending")} bg-opacity-20`}>
              <span className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Status: <span className="uppercase">{selectedBooking.status || "Pending"}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><User className="w-3 h-3" /> Client Info</h4>
                <p className="font-bold text-slate-800 text-lg">{selectedBooking.fullname}</p>
                <div className="mt-2 space-y-1">
                    <p className="text-slate-500 text-sm flex items-center gap-2"><Mail className="w-3 h-3"/> {selectedBooking.email}</p>
                    <p className="text-slate-500 text-sm flex items-center gap-2"><Phone className="w-3 h-3"/> {selectedBooking.phonenumber}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Package className="w-3 h-3" /> Package Details</h4>
                <p className="font-semibold text-indigo-600">{selectedBooking.category}</p>
                <p className="text-slate-600 font-medium mt-1">{selectedBooking.details}</p>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                 <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div><p className="text-xs font-bold text-slate-400 uppercase">Date & Time</p><p className="font-medium text-slate-700">{new Date(selectedBooking.date).toDateString()} at {selectedBooking.time}</p></div>
              </div>
              <div className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div><p className="text-xs font-bold text-slate-400 uppercase">Location/Venue</p><p className="font-medium text-slate-700">{selectedBooking.location}</p></div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              {(selectedBooking.status || "Pending") === 'Pending' && (
                <>
                  <button onClick={() => handleStatusUpdate(selectedBooking.userID, 'Cancelled')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">Reject</button>
                  <button onClick={() => handleStatusUpdate(selectedBooking.userID, 'Confirmed')} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">Approve Booking</button>
                </>
              )}

              {selectedBooking.status === 'Confirmed' && (
                <>
                  <button onClick={() => handleStatusUpdate(selectedBooking.userID, 'Cancelled')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">Cancel Booking</button>
                  <button onClick={() => handleStatusUpdate(selectedBooking.userID, 'Completed')} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2"><CheckSquare className="w-4 h-4" /> Mark as Completed</button>
                </>
              )}

              {['Completed', 'Cancelled'].includes(selectedBooking.status) && (
                 <button onClick={() => handleDelete(selectedBooking.userID)} className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Delete Record</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingList;