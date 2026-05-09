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
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                  role === "PATIENT"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Patient
              </button>

              <button
                type="button"
                onClick={() => setRole("DENTIST")}
                className={`px-5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                  role === "DENTIST"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dentist
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                First Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Last Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  {...register("username")}
                  placeholder="Enter username"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={signup.isPending}
            className="w-full bg-primary py-3 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-sm hover:opacity-90"
          >
            {signup.isPending ? "Creating..." : "Create Account"}

            <MoveRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p>
            Already have account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-6">
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
