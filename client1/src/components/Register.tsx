import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

type Props = {
  onRegister: () => void;
  switchToLogin: () => void;
};

export default function Register({ switchToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ cleanup memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1, // 🔥 final size (1MB)
        maxWidthOrHeight: 800, // 🔥 resize bhi karega
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      console.log("Original:", file.size / 1024, "KB");
      console.log("Compressed:", compressedFile.size / 1024, "KB");

      setProfilePic(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("Compression error:", err);
    }
  };

  const handleRegister = async () => {
    try {
      if (!username || !email || !password) {
        alert("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      // ✅ only append if selected
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

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
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-linear-to-br from-[#fdf8ee] to-[#f5e8b0]">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Create an account
          </h2>

          {/* ✅ PROFILE PIC */}
          <div className="mb-5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2">
              <img
                src={
                  preview || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // ✅ default image
                }
                className="w-full h-full object-cover"
              />
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
