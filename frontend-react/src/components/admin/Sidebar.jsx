// src/components/admin/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, CalendarDays, Users, FileText, Camera, Menu } from "lucide-react";

const Sidebar = ({ isSidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const activeTab = location.pathname;

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/manage", label: "Manage Services", icon: Settings },
    { path: "/admin/bookings", label: "Booking List", icon: CalendarDays },
    { path: "/admin/students", label: "Student ID List", icon: Users },
    { path: "/admin/reports", label: "Reports", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" 
          onClick={() => onToggleSidebar(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white transition-transform duration-300 ${ isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" }`}>
        
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
                {/* Colorful Logo Box */}
                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Camera className="w-5 h-5 text-white" />
                </div>
                {/* Text with Color Accent */}
                <h1 className="font-bold text-xl tracking-tight text-slate-100">
                    Snap<span className="text-indigo-400">Hub</span>
                </h1>
            </div>
            <button className="lg:hidden ml-auto text-slate-400 hover:text-white" onClick={() => onToggleSidebar(false)}>
                <Menu className="w-6 h-6" />
            </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
            {navItems.map((item) => ( 
                <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => onToggleSidebar(false)} 
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${ 
                        activeTab === item.path 
                            // Active State: Gradient Background + Shadow
                            ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/30" 
                            // Inactive State: Blend with Slate
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100" 
                    }`}
                >
                    <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.path ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                </Link> 
            ))}
        </nav>

        {/* Optional: Footer area or User Profile could go here */}
        
      </aside>
    </>
  );
};

export default Sidebar;