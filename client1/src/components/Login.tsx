import { useState } from "react";
import { useChat } from "../hooks/useChat";
import toast from "react-hot-toast";
import { LogIn, Loader2 } from "lucide-react";

type Props = {
  onLogin: () => void;
  switchToRegister: () => void;
};

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL in Login.tsx:", API_URL);

export default function Login({ onLogin, switchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useChat();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        const userData = {
          _id: data.user._id,
          username: data.user.username,
          profilePic: data.user.profilePic,
          roomId: data.user.roomId,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        toast.success("Welcome back! 🎉", { id: toastId });
        onLogin();
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-6 py-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-white text-xl text-center font-bold mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Don't have an account?{" "}
          <button
            onClick={switchToRegister}
            className="text-blue-500 hover:text-blue-400 font-medium transition"
          >
            Sign up
          </button>
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-lg bg-[#111] text-white border border-[#333] focus:border-blue-500 focus:outline-none transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-lg bg-[#111] text-white border border-[#333] focus:border-blue-500 focus:outline-none transition"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}