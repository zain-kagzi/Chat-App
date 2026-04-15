import { useState } from "react";

type Props = {
  onRegister: () => void;
  switchToLogin: () => void;
};

export default function Register({ onRegister, switchToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully! Please login.");
        switchToLogin(); // go to login screen
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-white text-xl mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 py-2 rounded text-white"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-green-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}