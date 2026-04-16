import { useState } from "react";

type Props = {
  onRegister: () => void;
  switchToLogin: () => void;
};

export default function Register({ switchToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registered successfully! Please login.");
        switchToLogin();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const newLocal = "flex gap-1.5 mb-7";
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ede8] p-4 font-sans">
      <div className="flex w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-[#faf8f4]">

        {/* ─── Left: Register Form ─── */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-linear-to-br from-[#fdf8ee] to-[#f5e8b0]">

          {/* Logo */}
          <div className="mb-7 w-fit">
            <span className="border border-gray-800 rounded-full px-4 py-1.5 text-sm font-medium text-gray-900 tracking-wide">
              Crextio
            </span>
          </div>

          {/* Step indicator */}
          <div className={newLocal}>
            <div className="flex-1 h-0.75 rounded-full bg-yellow-400" />
            <div className="flex-1 h-0.75 rounded-full bg-[#e8e4da]" />
            <div className="flex-1 h-0.75 rounded-full bg-[#e8e4da]" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create an account</h2>
          <p className="text-sm text-gray-400 mb-7">Sign up and get 30 day free trial</p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">Username</label>
            <input
              type="text"
              placeholder="amelielaurent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-yellow-300 transition"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-yellow-300 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-yellow-300 transition pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-[#f5c842] hover:bg-[#e8b800] transition-colors text-gray-900 font-semibold py-3.5 rounded-full text-sm mb-4 active:scale-[0.98]"
          >
            Register
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-400 transition rounded-full py-2.5 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-400 transition rounded-full py-2.5 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <span
                onClick={switchToLogin}
                className="text-gray-600 underline cursor-pointer hover:text-gray-900 transition"
              >
                Login
              </span>
            </p>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition">
              Terms &amp; Conditions
            </a>
          </div>
        </div>

        {/* ─── Right: Decorative Panel ─── */}
        <div className="hidden md:flex w-72 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-[#c8b89a] to-[#7a6a58]" />
          <div className="absolute inset-0 bg-black/10" />

          <button className="absolute top-3 right-3 z-20 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 text-xs transition">
            ✕
          </button>

          {/* Top card */}
          <div className="absolute top-8 left-4 right-12 z-10 bg-white rounded-2xl p-3 shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-800">Task Review With Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">09:30am–10:00am</p>
          </div>

          {/* Bottom card */}
          <div className="absolute bottom-14 left-4 right-4 z-10 bg-white rounded-2xl p-3 shadow-lg">
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-100">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                <div key={d} className="text-center">
                  <div className="text-[8px] text-gray-400">{d}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${i === 3 ? "bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center mx-auto" : "text-gray-700"}`}>
                    {22 + i}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-800">Daily Meeting</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 mb-2">12:00pm–01:00pm</p>
            <div className="flex">
              {["#c9a96e","#8fb3c9","#b9a6c9","#9ec9a6"].map((color, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white -ml-1.5 first:ml-0" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}