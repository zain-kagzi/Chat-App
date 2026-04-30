import { useState } from "react";
import { useChat } from "../hooks/useChat";

type Props = {
  onLogin: () => void;
  switchToRegister: () => void;
};

export default function Login({ onLogin, switchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useChat();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://chat-app-6uvx.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        // ✅ FIXED (user object se data lena hai)
        const userData = {
          _id: data.user._id,
          username: data.user.username,
          profilePic: data.user.profilePic,
          roomId:data.user.roomId
        };

        // ✅ Save in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Update context
        setUser(userData);
        onLogin();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-6 py-8">

        <h2 className="text-white text-xl text-center mb-4">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Don't have an account?{" "}
          <span
            onClick={switchToRegister}
            className="text-blue-500 cursor-pointer"
          >
            Sign up
          </span>
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-[#111] text-white border border-[#333]"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#111] text-white border border-[#333]"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded-lg text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}