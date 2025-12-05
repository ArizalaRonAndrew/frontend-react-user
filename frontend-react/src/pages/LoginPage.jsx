import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      setMsgType("error");
      return;
    }

    try {
      if (isLoginMode) {
        const result = await AuthService.login(username, password);
        console.log("Login API Response:", result); // Keep debugging log

        // FIXED LOGIC: Accept login if token exists OR if success is true
        if (result.token || result.accessToken || result.success) {
          setMsgType("success");
          setMessage(`Welcome back, ${result.user?.username || username}!`);

          // 1. Determine Token (Use placeholder if backend didn't send one)
          const validToken =
            result.token || result.accessToken || "session-active";

          // 2. Save Session (Essential for ProtectedAdminRoute)
          AuthService.setSession(validToken, result.user);

          // 3. Redirect to Admin Dashboard
          setTimeout(() => {
            console.log("Redirecting to Admin Dashboard...");
            navigate("/admin/dashboard", { replace: true });
          }, 1000);
        } else {
          setMsgType("error");
          setMessage(
            result.message || "Login failed. Please check credentials."
          );
        }
      } else {
        await AuthService.register(username, password);
        setMsgType("success");
        setMessage("Account created successfully! Please sign in.");
        setTimeout(() => setIsLoginMode(true), 1500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMsgType("error");
      setMessage(
        error.response?.data?.message || error.message || "An error occurred."
      );
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-light text-stone-800 tracking-wide uppercase">
            Lens & Light Studio
          </h1>
        </div>

        <h2 className="text-2xl font-semibold text-stone-800 text-center mb-6">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-stone-600 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-400"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-stone-600 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-400"
              placeholder="Enter your password"
            />
          </div>

          <p
            className={`text-sm mb-4 text-center min-h-5 font-medium ${
              msgType === "success"
                ? "text-green-600"
                : msgType === "error"
                ? "text-red-600"
                : ""
            }`}
          >
            {message}
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition"
          >
            {isLoginMode ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-stone-600">
            {isLoginMode ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-stone-900 font-medium underline hover:text-stone-700"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-stone-900 font-medium underline hover:text-stone-700"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
