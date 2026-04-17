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

  // ✅ NEW STATES
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ IMAGE HANDLER
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    try {
      // ✅ validation
      if (!username || !email || !password) {
        alert("All fields are required");
        return;
      }

      // ✅ form data
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      console.log("Sending data...");

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      // ✅ safe JSON parse
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      console.log("Response:", data);

      if (res.ok) {
        alert("Registered successfully! Please login.");
        switchToLogin();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      alert(err.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ede8] p-4 font-sans">
      <div className="flex w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-[#faf8f4]">
        {/* LEFT */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-linear-to-br from-[#fdf8ee] to-[#f5e8b0]">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Create an account
          </h2>

          {/* ✅ PROFILE PIC */}
          <div className="mb-5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs"
            />
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-3 px-4 py-3 rounded-xl"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 px-4 py-3 rounded-xl"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Register */}
          <button
            onClick={handleRegister}
            className="bg-yellow-400 py-3 rounded-full font-semibold"
          >
            Register
          </button>

          {/* Switch */}
          <p className="text-sm mt-4">
            Already have account?{" "}
            <span onClick={switchToLogin} className="underline cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
