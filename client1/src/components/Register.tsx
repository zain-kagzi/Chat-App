import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";

type Props = {
  onRegister: () => void;
  switchToLogin: () => void;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Register({ switchToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setProfilePic(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      toast.success("Image compressed successfully");
    } catch (err) {
      toast.error("Image compression failed");
      console.error(err);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created! Please login.", { id: toastId });
      switchToLogin();
    } catch (err: any) {
      toast.error(err.message || "Registration failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0ede8] p-4 font-sans">
      <div className="flex w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-[#faf8f4]">
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-[#fdf8ee] to-[#f5e8b0]">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Create an account
            </h2>
          </div>

          {/* Profile Pic */}
          <div className="mb-5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2 border-4 border-white shadow-lg">
              <img
                src={
                  preview ||
                  "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                }
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed py-3 rounded-full font-semibold text-gray-900 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="text-sm mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={switchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}