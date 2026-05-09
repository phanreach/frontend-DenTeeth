import { useState } from "react";
import { Eye, EyeClosed, Lock, Shield, User, Zap } from "lucide-react";
import Navbar from "../components/nav-bar";
import { useNavigate } from "react-router-dom";
import useLogin from "../components/hook/auth/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchema,
} from "../components/lib/schema/login-schema";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginMutation.mutateAsync(data);

      const role = Cookies.get("role");

      if (role?.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      // error handled in hook
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto space-y-10 py-20">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-semibold text-3xl tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Clinical intelligence with Human Touch
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="john_doe"
                  {...register("username")}
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mb-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-xl transition-all duration-200"
            >
              Sign In
            </button>
          </form>
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
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
