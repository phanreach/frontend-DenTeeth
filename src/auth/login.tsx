import { useState } from "react";
import {
  Eye,
  EyeClosed,
  Lock,
  User,
  MoveRight,
  Stethoscope,
} from "lucide-react";

import Navbar from "../components/nav-bar";
import useLogin from "../components/hook/auth/use-login";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  type LoginSchema,
} from "../components/lib/schema/login-schema";

import { useForm } from "react-hook-form";

export default function Login() {
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
    } catch {
      // error handled in hook
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto space-y-10 py-20 px-4">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg rotate-6 transition-all duration-500 ease-in-out">
              <span className="text-white text-2xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </span>
            </div>
          </div>

          <h1 className="font-bold text-3xl tracking-tight text-gray-900">
            Welcome Back
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-sm border shadow-xl rounded-3xl p-8 space-y-6 transition-all duration-500"
        >
          <div className="h-1 w-12 rounded-full mx-auto bg-primary transition-all duration-500" />

          <div className="group">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Username <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary transition-colors duration-300"
              />

              <input
                type="text"
                placeholder="john_doe"
                {...register("username")}
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>

              <a
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline underline-offset-2"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary transition-colors duration-300"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-11 text-sm outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-primary"
              />

              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300"
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

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed bg-primary"
          >
            {loginMutation.isPending ? (
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <MoveRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors duration-300"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
