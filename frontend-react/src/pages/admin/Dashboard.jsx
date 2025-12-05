import React, { useEffect, useState } from 'react';
import { CalendarCheck, Clock, IdCard, PhilippinePeso, Camera, UserPlus } from "lucide-react";
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

            // Safety check for arrays
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
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayStatus = (day) => {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isOccupied = bookings.some(b => b.date === dateString && b.status === 'Confirmed');
      const isToday = dateString === today.toISOString().split('T')[0];
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
            color="text-blue-600" 
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
            icon={PhilippinePeso} 
            color="text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- RECENT ACTIVITY LIST --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Database Activity</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* 1. Map Recent Bookings */}
            {bookings.slice(0, 3).map((b) => (
              <div key={`booking-${b.id}`} className="flex items-start pb-4 border-b border-slate-100 last:border-0">
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

            {/* 2. Map Recent Students (Aligned with DB Columns) */}
            {students.slice(0, 3).map((s) => (
              <div key={`student-${s.id}`} className="flex items-start pb-4 border-b border-slate-100 last:border-0">
                <div className="bg-violet-50 p-2 rounded-lg mr-4">
                  <UserPlus className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">ID Application</p>
                  {/* FIX: Using SQL column names (first_name, last_name) */}
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
                      
                      return (
                          <div key={`day-${day}`} className="flex justify-center">
                              <div 
                                  className={`
                                    h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all relative
                                    ${isToday ? 'border-2 border-indigo-600 font-bold text-indigo-700' : ''}
                                    ${isOccupied ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'}
                                  `}
                                  title={isOccupied ? "Booked" : "Available"}
                              >
                                  {day}
                                  {isOccupied && isToday && <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full"></div>}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;