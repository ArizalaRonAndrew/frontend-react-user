import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Trash2,
  CheckCheck,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  Clock,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Modal from "../../components/admin/Modal";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../services/BookingService";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const data = await getAllBookings();
    // CRITICAL FIX: Ensure array
    setBookings(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    fetchBookings();
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const handleUpdateStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    fetchBookings();
  };

  const askConfirmation = (e, id, newStatus, action = "update") => {
    e.stopPropagation();
    let config = { id, newStatus, action };

    if (action === "delete") {
      config.title = "Delete Booking?";
      config.message = "Permanently remove this booking from the record?";
      config.color = "bg-red-600";
    } else {
      if (newStatus === "Confirmed") {
        config.title = "Confirm Booking?";
        config.message = "Are you sure you want to approve this booking?";
        config.color = "bg-emerald-600";
      } else if (newStatus === "Completed") {
        config.title = "Mark as Done?";
        config.message = "Are you sure this event is finished?";
        config.color = "bg-blue-600";
      } else if (newStatus === "Rejected") {
        config.title = "Reject Booking?";
        config.message = "Are you sure you want to reject this booking?";
        config.color = "bg-red-600";
      }
    }
    setConfirmation(config);
  };

  const executeConfirmation = async () => {
    if (!confirmation) return;

    if (confirmation.action === "delete") {
      await handleDelete(confirmation.id);
    } else if (confirmation.action === "update") {
      await handleUpdateStatus(confirmation.id, confirmation.newStatus);
    }

    setConfirmation(null);
  };

  const filteredBookings = bookings.filter((b) => {
    if (b.status === "Completed") return false;
    return filter === "All" || b.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (filter === "Confirmed") return new Date(a.date) - new Date(b.date);
    return a.id - b.id;
  });

  return (
    <div className="space-y-6 h-full flex flex-col p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking List</h2>
          <p className="text-slate-500 text-sm">
            Click on a row to view full details.
          </p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200">
          {["All", "Pending", "Confirmed", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                filter === status
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col grow">
        <div className="overflow-auto custom-scrollbar h-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 bg-slate-50">Client</th>
                <th className="px-6 py-4 bg-slate-50">Event Date</th>
                <th className="px-6 py-4 bg-slate-50">Package</th>
                <th className="px-6 py-4 bg-slate-50">Status</th>
                <th className="px-6 py-4 text-center bg-slate-50">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="hover:bg-indigo-50 transition cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                      {booking.fullname}
                    </div>
                    <div className="text-xs text-slate-500">
                      {booking.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      <CalendarDays className="w-3 h-3 mr-1 text-indigo-500" />{" "}
                      {booking.date}
                    </div>
                    <div className="text-xs text-slate-500 pl-4">
                      {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {booking.category}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {booking.Package_type || booking.package}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={(e) =>
                              askConfirmation(e, booking.id, "Confirmed")
                            }
                            className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) =>
                              askConfirmation(e, booking.id, "Rejected")
                            }
                            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {booking.status === "Confirmed" && (
                        <>
                          <button
                            onClick={(e) =>
                              askConfirmation(e, booking.id, "Completed")
                            }
                            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <CheckCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) =>
                              askConfirmation(e, booking.id, "Rejected")
                            }
                            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {booking.status === "Rejected" && (
                        <button
                          onClick={(e) =>
                            askConfirmation(e, booking.id, null, "delete")
                          }
                          className="p-1.5 rounded-full bg-slate-100 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sortedBookings.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-400 italic"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-xl flex justify-between items-center shadow-sm ${
                selectedBooking.status === "Confirmed"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              <span className="font-extrabold text-lg tracking-wide uppercase">
                {selectedBooking.status}
              </span>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-70">
                  Booking ID
                </p>
                <p className="font-mono font-bold text-lg">
                  #{selectedBooking.id}
                </p>
              </div>
            </div>
            {/* Details Content */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400">Client</p>
                <p className="font-bold text-slate-800">
                  {selectedBooking.fullname}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Contact</p>
                <p className="text-slate-700">
                  {selectedBooking.email} | {selectedBooking.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Event</p>
                <p className="text-slate-700">
                  {selectedBooking.category} - {selectedBooking.date} @{" "}
                  {selectedBooking.time}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Location</p>
                <p className="text-slate-700">{selectedBooking.location}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Notes</p>
                <p className="text-slate-600 italic">
                  {selectedBooking.details || "No additional notes"}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              {selectedBooking.status === "Pending" && (
                <button
                  onClick={(e) =>
                    askConfirmation(e, selectedBooking.id, "Confirmed")
                  }
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                  Confirm Booking
                </button>
              )}
              {(selectedBooking.status === "Pending" ||
                selectedBooking.status === "Confirmed") && (
                <button
                  onClick={(e) =>
                    askConfirmation(e, selectedBooking.id, "Rejected")
                  }
                  className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition"
                >
                  Reject
                </button>
              )}
              {selectedBooking.status === "Rejected" && (
                <button
                  onClick={(e) =>
                    askConfirmation(e, selectedBooking.id, null, "delete")
                  }
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Delete Permanently
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        title="Confirmation"
      >
        {confirmation && (
          <div className="text-center py-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {confirmation.title}
            </h3>
            <p className="text-slate-500 mb-8 px-4">{confirmation.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmation(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmation}
                className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition ${confirmation.color}`}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingList;
