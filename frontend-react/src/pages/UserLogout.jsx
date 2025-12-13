// src/pages/UserLogout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckCircle, Loader2 } from "lucide-react";

export default function UserLogout() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      // Simulate logout process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear user session
      localStorage.removeItem("currentUser");

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        {isLoggingOut ? (
          <>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Logging Out...
            </h2>
            <p className="text-slate-500">
              Please wait while we securely log you out
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Logged Out Successfully
            </h2>
            <p className="text-slate-500 mb-6">
              You have been safely logged out of your account
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to login...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
