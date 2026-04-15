import { useState } from "react";

type Props = {
  onLogin: () => void;
  switchToRegister: () => void;
};

export default function Login({ onLogin, switchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); // 👈 IMPORTANT
        onLogin();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-white text-xl mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 py-2 rounded text-white"
        >
          Login
        </button>

        {/* 👇 Move this inside the card for better UI */}
        <p className="text-gray-400 text-sm mt-3 text-center">
          Don't have an account?{" "}
          <span
            onClick={switchToRegister}
            className="text-blue-400 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
