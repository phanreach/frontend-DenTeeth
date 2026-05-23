import { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Shield,
  Zap,
  MoveRight,
  Eye,
  EyeClosed,
  Stethoscope,
} from "lucide-react";

import Navbar from "../components/nav-bar";
import useSignup from "../components/hook/auth/use-signup";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignupSchema } from "../components/lib/schema/signup-schema";

export default function SignUp() {
  const signup = useSignup();

  const [role, setRole] = useState("PATIENT");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      await signup.mutateAsync({
        ...data,
        roleId: role === "PATIENT" ? 3 : 2,
      });
    } catch {
      // handled in hook
    }
  };

  const isDentist = role === "DENTIST";

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto space-y-10 py-20 px-4">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out ${
                isDentist ? "rotate-12" : "-rotate-12"
              }`}
            >
              <span className="text-white text-2xl flex items-center justify-center">
                {isDentist ? "🦷" : <Stethoscope className="w-8 h-8" />}
              </span>
            </div>
          </div>

          <h1 className="font-bold text-3xl tracking-tight text-gray-900">
            Create Your Account
          </h1>

          <p className="text-sm font-medium transition-all duration-500 text-primary">
            {isDentist
              ? "Join as a dental professional"
              : "Clinical intelligence with a human touch"}
          </p>

          <div className="flex justify-center pt-2">
            <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`px-6 py-2 text-sm rounded-xl font-semibold transition-all duration-300 ${
                  !isDentist
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Patient
              </button>

              <button
                type="button"
                onClick={() => setRole("DENTIST")}
                className={`px-6 py-2 text-sm rounded-xl font-semibold transition-all duration-300 ${
                  isDentist
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dentist
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm border shadow-xl rounded-3xl p-8 space-y-6 transition-all duration-500"
        >
          <div
            className={`h-1 rounded-full mx-auto transition-all duration-500 ${
              isDentist ? "w-20 bg-primary" : "w-12 bg-primary"
            }`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-primary"
                />
                <input
                  {...register("firstName")}
                  placeholder="First name"
                  className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-primary"
                />
                <input
                  {...register("lastName")}
                  placeholder="Last name"
                  className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-primary"
                />
                <input
                  {...register("username")}
                  placeholder="Username"
                  className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-primary"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-primary"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-11 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={signup.isPending}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed bg-primary"
          >
            {signup.isPending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <MoveRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold transition-colors duration-300 hover:underline underline-offset-2 text-primary"
          >
            Log in
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: <Shield className="w-4 h-4" />, label: "Secure Data" },
            { icon: <Zap className="w-4 h-4" />, label: "AI Powered" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-xl border transition-all duration-500 text-primary"
            >
              {icon}
              <span className="text-xs font-bold tracking-widest uppercase text-gray-600">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
