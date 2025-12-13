// src/pages/admin/AdminLogout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, CheckCircle, Loader2 } from "lucide-react";

export default function AdminLogout() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      // Simulate logout process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear admin session
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Mark as complete
      setIsLoggingOut(false);

      // Redirect after showing success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    };

    performLogout();
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 
                    bg-[url('https://images.unsplash.com/photo-1668453814676-c8093305fae6?w=1920&q=80')] 
                    bg-cover bg-center relative"
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[3px]"></div>

      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-4 border-stone-800">
        {isLoggingOut ? (
          <>
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-8 h-8 text-stone-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              Ending Admin Session
            </h2>
            <p className="text-stone-500 text-sm uppercase tracking-wide">
              Securing system access...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              Session Terminated
            </h2>
            <p className="text-stone-500 mb-6">
              Admin privileges have been revoked
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-stone-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Returning to role selection...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
