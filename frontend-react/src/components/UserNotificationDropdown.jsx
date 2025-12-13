// src/components/UserNotificationDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Calendar, IdCard } from "lucide-react";

export default function UserNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Fetch notifications for current user
  const fetchNotifications = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      // Fetch user's bookings
      const bookingRes = await fetch(
        `http://localhost:5000/api/bookings/user/${user.userName}`
      );
      const bookingData = await bookingRes.json();

      // Fetch user's student ID applications
      const studentRes = await fetch(
        `http://localhost:5000/api/student-id/user/${user.userName}`
      );
      const studentData = await studentRes.json();

      // Combine and format notifications
      const allNotifications = [];

      // Add booking notifications
      if (Array.isArray(bookingData.bookings)) {
        bookingData.bookings.forEach((booking) => {
          allNotifications.push({
            id: `booking-${booking.userID}`,
            type: "booking",
            status: booking.status || "Pending",
            message: `Your ${booking.category} booking is ${
              booking.status || "Pending"
            }`,
            detail: `${booking.Package_type} on ${new Date(
              booking.date
            ).toLocaleDateString()}`,
            date: booking.date,
            isRead: false,
          });
        });
      }

      // Add student ID notifications
      if (Array.isArray(studentData.students)) {
        studentData.students.forEach((student) => {
          allNotifications.push({
            id: `student-${student.id}`,
            type: "student",
            status: student.status || "Pending",
            message: `Your Student ID application is ${
              student.status || "Pending"
            }`,
            detail: `${student.grade} - ${student.section}`,
            date: student.submitted_at || student.created_at,
            isRead: false,
          });
        });
      }

      // Sort by date (newest first)
      allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));

      setNotifications(allNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "Approved":
        return "text-emerald-600 bg-emerald-50";
      case "Completed":
        return "text-blue-600 bg-blue-50";
      case "Cancelled":
      case "Rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getStatusIcon = (type, status) => {
    if (type === "booking") {
      return <Calendar className="w-4 h-4" />;
    }
    return <IdCard className="w-4 h-4" />;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition relative"
      >
        <Bell
          className={`w-6 h-6 ${
            unreadCount > 0 ? "text-indigo-600 animate-pulse" : ""
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center border border-white font-bold">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Your Updates</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
              {notifications.length} Total
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs mt-1">
                  We'll notify you when there are updates
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`mt-1 p-2 rounded-full ${getStatusColor(
                          notif.status
                        )}`}
                      >
                        {getStatusIcon(notif.type, notif.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {notif.detail}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                              notif.status
                            )}`}
                          >
                            {notif.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(notif.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                // Optional: Navigate to a full notifications page
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
