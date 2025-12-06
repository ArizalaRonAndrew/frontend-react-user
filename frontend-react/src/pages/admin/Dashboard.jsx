import React, { useEffect, useState } from 'react';
// Changed BookCheck to CalendarCheck, and PhilippinePeso to Banknote
import { CalendarCheck, Clock, IdCard, Banknote, Camera, UserPlus } from "lucide-react";
import StatCard from '../../components/admin/StatCard';
import { getAllBookings } from '../../services/BookingService';
import { getAllStudents } from '../../services/StudentIdService';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [bookingsData, studentsData] = await Promise.all([
                getAllBookings(),
                getAllStudents()
            ]);

            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            setStudents(Array.isArray(studentsData) ? studentsData : []);
            
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };
    fetchData();
  }, []);

  // --- KPI CALCULATIONS ---
  const totalBookings = bookings.length;
  const totalStudents = students.length; 
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const completedBookingsCount = bookings.filter((b) => b.status === "Completed").length;
  const revenue = completedBookingsCount * 5000;

  // --- CALENDAR LOGIC ---
  const todayObj = new Date();
  const currentMonth = todayObj.getMonth();
  const currentYear = todayObj.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // HELPER: Normalize any date input to a simple "YYYY-MM-DD" string
  const formatDateKey = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return ""; 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = formatDateKey(new Date());

  // Helper: Determine status for a specific day cell
  const getDayStatus = (day) => {
      const cellDate = new Date(currentYear, currentMonth, day);
      const cellDateKey = formatDateKey(cellDate);
      
      const isToday = cellDateKey === todayKey;
      const isFuture = cellDateKey > todayKey; 
      
      let isOccupied = false;

      // RULE: Only mark as occupied if it is strictly a FUTURE date (Tomorrow onwards)
      if (isFuture) {
          isOccupied = bookings.some(b => {
               const bookingDateKey = formatDateKey(b.date);
               return bookingDateKey === cellDateKey && b.status === 'Confirmed';
          });
      }

      return { isOccupied, isToday };
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto p-4 lg:p-8">
      
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      
      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Bookings" 
            value={totalBookings} 
            icon={CalendarCheck} 
            color="text-orange-600" 
        />
        <StatCard 
            title="Pending Bookings" 
            value={pendingBookings} 
            icon={Clock} 
            color="text-amber-500" 
        />
        <StatCard 
            title="Student Applications" 
            value={totalStudents} 
            icon={IdCard} 
            color="text-violet-600" 
        />
        <StatCard 
            title="Total Revenue" 
            value={`₱${revenue.toLocaleString()}`} 
            icon={Banknote} 
            color="text-green-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- RECENT ACTIVITY LIST --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Database Activity</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            
            {bookings.slice(0, 3).map((b) => (
              <div key={`booking-${b.userID || b.id || Math.random()}`} className="flex items-start pb-4 border-b border-slate-100 last:border-0">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Booking: {b.category || "General"}</p>
                  <p className="text-sm text-slate-500">{b.fullname} - {b.date}</p>
                </div>
                <span className="ml-auto px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                  {b.status}
                </span>
              </div>
            ))}

            {students.slice(0, 3).map((s) => (
              <div key={`student-${s.id || Math.random()}`} className="flex items-start pb-4 border-b border-slate-100 last:border-0">
                <div className="bg-violet-50 p-2 rounded-lg mr-4">
                  <UserPlus className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">ID Application</p>
                  <p className="text-sm text-slate-500 capitalize">
                    {s.first_name} {s.last_name} • {s.grade}
                  </p>
                </div>
                <span className="ml-auto px-2 py-1 text-xs font-bold rounded-full bg-violet-100 text-violet-700">
                  New
                </span>
              </div>
            ))}

            {bookings.length === 0 && students.length === 0 && (
                <p className="text-gray-400 italic text-sm text-center py-4">No activity found in database.</p>
            )}
          </div>
        </div>
        
        {/* --- CALENDAR --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Studio Schedule</h3>
             <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{monthNames[currentMonth]} {currentYear}</span>
          </div>
          
          <div className="w-full">
              <div className="grid grid-cols-7 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wide py-1">{d}</div>
                  ))}
              </div>
              
              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                  {/* Empty Cells */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8 w-8"></div>
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const { isOccupied, isToday } = getDayStatus(day);

                      // --- CONDITIONAL STYLING ---
                      let cellClass = "h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all cursor-pointer ";
                      
                      if (isOccupied) {
                          cellClass += "bg-indigo-600 text-white font-bold shadow-sm hover:bg-indigo-700";
                      } else if (isToday) {
                          cellClass += "border-2 border-indigo-600 font-bold text-indigo-700 hover:bg-indigo-50";
                      } else {
                          cellClass += "text-slate-600 hover:bg-slate-100";
                      }

                      return (
                          <div key={`day-${day}`} className="flex justify-center">
                              <div 
                                  className={cellClass}
                                  title={isOccupied ? "Booked" : "Available"}
                              >
                                  <span className="leading-none">{day}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-end gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-indigo-600"></div> Upcoming Bookings</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-indigo-600"></div> Today</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;