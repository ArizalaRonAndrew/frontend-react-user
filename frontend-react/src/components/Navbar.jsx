import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none"     
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor" 
                    className="text-white size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h2.086c.404 0 .787-.162 1.07-.45l1.378-1.378c.283-.288.666-.45 1.07-.45h3.692c.404 0 .787.162 1.07.45l1.378 1.378c.283.288.666.45 1.07.45H18.5A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            </svg>
                <span className="text-lg font-semibold">SnapHub</span>
            </div>

            <ul className="flex gap-6 text-base font-medium">
                {/* CHANGED: Link points to /home instead of / */}
                <li><Link to="/home" className="hover:text-slate-300">Home</Link></li>
                <li><Link to="/booking" className="hover:text-slate-300">Booking Session</Link></li>
                <li><Link to="/student-id" className="hover:text-slate-300">Student ID</Link></li>
            </ul>
        </nav>
    );
}