import { useRef, useState } from "react";
import {
  ChevronDown,
  Lock,
  Mail,
  User,
  UploadCloud,
  BadgeCheck,
  Shield,
  Zap,
  MoveRight,
} from "lucide-react";
import Navbar from "../components/nav-bar";

export default function SignUp() {
  const [role, setRole] = useState("patient");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (f: File | undefined) => f && setFile(f);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto space-y-10 py-20">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-semibold text-3xl tracking-tight text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Clinical intelligence with Human Touch
          </p>

          {/* Role Switch */}
          <div className="flex justify-center pt-2">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setRole("patient")}
                className={`px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                  role === "patient"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setRole("dentist")}
                className={`px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                  role === "dentist"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dentist
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="25"
                className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Gender
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl py-2.5 px-3 pr-10 text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          {role === "dentist" && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2">
                <BadgeCheck className="text-blue-500" />
                <h1 className="font-semibold text-gray-800">
                  Professional Credentials
                </h1>
              </div>

              <p className="text-xs text-gray-500">
                Upload your medical or dental certification
              </p>

              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <UploadCloud
                  className={`mx-auto mb-2 ${
                    file ? "text-green-500" : "text-gray-400"
                  }`}
                />

                {file ? (
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Click or drag file to upload
                  </p>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}
          <button className="w-full bg-primary py-3 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-sm transition-all duration-200 hover:opacity-90">
            Create Account
            <MoveRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <p>
            Already have account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {[
            {
              icon: <Shield className="text-success w-5 h-5" />,
              label: "SECURE DATA",
            },
            {
              icon: <Zap className="text-success w-5 h-5" />,
              label: "AI POWERED",
            },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border justify-center w-full md:w-auto md:min-w-48"
            >
              {icon}
              <span className="text-xs font-semibold tracking-widest uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
