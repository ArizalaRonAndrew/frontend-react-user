import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center px-4 
                       bg-[url('https://images.unsplash.com/photo-1668453814676-c8093305fae6?w=1920&q=80')]
                       bg-cover bg-center relative"
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55"></div>

            {/* Centered SVG */}
            <div className="relative flex justify-center mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none"     
                    viewBox="0 0 24 24" 
                    stroke-width="2" 
                    stroke="currentColor" 
                    className="text-white size-15">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h2.086c.404 0 .787-.162 1.07-.45l1.378-1.378c.283-.288.666-.45 1.07-.45h3.692c.404 0 .787.162 1.07.45l1.378 1.378c.283.288.666.45 1.07.45H18.5A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            </svg>

            </div>

            {/* Content */}
            <div className="relative text-center text-white max-w-3xl">
                <h1 className="text-7xl font-bold mb-6">Capture Your Special Moments</h1>

                <p className="text-lg mb-10">
                    Professional photography for weddings, debuts, birthdays, and milestones.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/booking"
                        className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-lg transition"
                    >
                        Book a Session
                    </Link>

                    <a
                        href="#services"
                        className="px-8 py-3 border-2 border-white hover:bg-white/10 rounded-lg transition"
                    >
                        View Services
                    </a>

                    <Link
                        to="/student-id"
                        className="px-8 py-3 border-2 border-white hover:bg-white/10 rounded-lg transition"
                    >
                        Student ID
                    </Link>
                </div>
            </div>
        </section>
    );
}
