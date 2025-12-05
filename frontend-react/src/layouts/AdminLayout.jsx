// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar isSidebarOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Admin Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm relative shrink-0">
          <button
            className="lg:hidden text-slate-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-700 hidden lg:block">
            Admin Panel
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
