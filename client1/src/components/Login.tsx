import { useState } from "react";

type Props = {
  onLogin: () => void;
  switchToRegister: () => void;
};

const CornerDecor = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 90 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${flip ? "scale-x-[-1]" : ""}`}
  >
    <rect x="0" y="18" width="30" height="4" fill="#222" />
    <rect x="30" y="0" width="4" height="22" fill="#222" />
    <rect x="34" y="0" width="40" height="18" rx="4" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="0.5" />
    <circle cx="34" cy="18" r="3" fill="#2e2e2e" />
    <rect x="38" y="6" width="4" height="6" rx="1" fill="#2a2a2a" />
    <rect x="44" y="6" width="4" height="6" rx="1" fill="#2a2a2a" />
    <rect x="50" y="6" width="4" height="6" rx="1" fill="#2a2a2a" />
    <circle cx="64" cy="18" r="3" fill="#3b82f6" fillOpacity="0.7" />
  </svg>
);

const CornerDecorBottom = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 90 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full ${flip ? "scale-x-[-1]" : ""}`}
  >
    <rect x="0" y="18" width="30" height="4" fill="#222" />
    <rect x="30" y="18" width="4" height="22" fill="#222" />
    <rect x="34" y="22" width="40" height="18" rx="4" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="0.5" />
    <circle cx="34" cy="22" r="3" fill="#2e2e2e" />
    <rect x="38" y="28" width="4" height="6" rx="1" fill="#2a2a2a" />
    <rect x="44" y="28" width="4" height="6" rx="1" fill="#2a2a2a" />
    <rect x="50" y="28" width="4" height="6" rx="1" fill="#2a2a2a" />
    <circle cx="64" cy="22" r="3" fill="#3b82f6" fillOpacity="0.7" />
  </svg>
);

export default function Login({ onLogin, switchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onLogin();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] relative overflow-hidden px-4 py-10">

      {/* Corner Decorations — hidden on very small screens */}
      <div className="hidden sm:block absolute top-12 left-4 w-20 h-10">
        <CornerDecor />
      </div>
      <div className="hidden sm:block absolute top-12 right-4 w-20 h-10">
        <CornerDecor flip />
      </div>
      <div className="hidden sm:block absolute bottom-12 left-4 w-20 h-10">
        <CornerDecorBottom />
      </div>
      <div className="hidden sm:block absolute bottom-12 right-4 w-20 h-10">
        <CornerDecorBottom flip />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-6 py-8 z-10">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[#2e2e2e] text-xs tracking-widest">· · · · ·</span>
            <div className="w-11 h-11 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M8 12 Q12 6 16 12" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[#2e2e2e] text-xs tracking-widest">· · · · ·</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[#f0f0f0] text-xl font-medium text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-[#555] text-sm text-center mb-6">
          Don't have an account yet?{" "}
          <span
            onClick={switchToRegister}
            className="text-blue-500 cursor-pointer hover:text-blue-400 transition-colors"
          >
            Sign up
          </span>
        </p>

        {/* Email Input */}
        <div className="relative mb-2.5">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#d0d0d0] placeholder-[#444] outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
          </svg>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#d0d0d0] placeholder-[#444] outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-1"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
      </div>
    </div>
  );
}