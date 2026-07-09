import { useState } from "react";
import {
  Eye,
  EyeClosed,
  Lock,
  Shield,
  User,
  Zap,
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

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border bg-white hover:bg-gray-50 rounded-xl py-3 text-sm font-medium text-gray-700 transition-all duration-300"
          >
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
