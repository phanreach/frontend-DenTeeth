import { MailCheck, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/nav-bar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import checkVerification from "../components/hook/auth/check-verification";
import { COOKIE_KEYS, getCookie } from "../utils/cookies";
import useResendVerification from "../components/hook/auth/resend-verification";
import api from "../api/api";
import { API_ENDPOINT } from "../api/endpoint";
import type {
  LoginApiResponse,
  LoginPayload,
} from "../components/hook/auth/use-login";
import {
  clearPendingSignupCredentials,
  getPendingSignupCredentials,
  navigateToHomeForRoles,
  saveAuthSession,
} from "../utils/auth-session";
import axios from "axios";
import { toast } from "sonner";

type CheckVerificationResponse = {
  success?: boolean;
  status?: number;
  message?: string;
  data?: boolean;
};

function isVerificationSuccessful(response?: CheckVerificationResponse) {
  return (
    response?.data === true ||
    (response?.status === 200 && response.data !== false)
  );
}

export default function VerifyEmail() {
  const [countdown, setCountdown] = useState(60);
  const [resendError, setResendError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const hasStartedLogin = useRef(false);

  const navigate = useNavigate();
  const { resendVerification, loading, error, success } =
    useResendVerification();

  const email = getCookie(COOKIE_KEYS.email);
  const loginAfterVerification = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post<LoginApiResponse>(API_ENDPOINT.LOGIN, payload);

      return res.data;
    },

    onSuccess: (response) => {
      saveAuthSession(response.data);
      clearPendingSignupCredentials();
      toast.success("Email verified. You're signed in now.");

      setTimeout(() => {
        navigateToHomeForRoles(navigate, response.data.roles);
      }, 1200);
    },

    onError: (err: unknown) => {
      let message =
        "Email verified, but automatic login failed. Please log in manually.";

      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string })?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setLoginError(message);
      toast.error(message);
    },
  });

  const { data } = useQuery<CheckVerificationResponse>({
    queryKey: ["check-verification", email],
    queryFn: () => checkVerification(email || ""),
    enabled: !!email,
    refetchInterval: (query) => {
      console.log("Polling response:", query.state.data);
      const verified = isVerificationSuccessful(query.state.data);
      return verified ? false : 3000;
    },
  });
  console.log("email from cookie:", email);
  const isVerified = isVerificationSuccessful(data);

  useEffect(() => {
    if (!isVerified || hasStartedLogin.current) {
      return;
    }

    hasStartedLogin.current = true;

    const credentials = getPendingSignupCredentials();

    if (!credentials) {
      const message =
        "Email verified. Please log in to continue because the signup session expired.";
      toast.info(message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);

      return;
    }

    loginAfterVerification.mutate({
      username: credentials.username,
      password: credentials.password,
    });
  }, [isVerified, loginAfterVerification, navigate]);

  useEffect(() => {
    if (isVerified || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isVerified]);

  const handleResend = async () => {
    if (!email) {
      setResendError("Email address is missing. Please sign up again.");
      return;
    }

    try {
      setResendError(null);
      await resendVerification(email);
      setCountdown(60);
    } catch {
      setResendError(null);
    }
  };

  const canResend = !!email && countdown === 0 && !loading;

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16 full-screen text-center">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md md:max-w-lg shadow-lg transition-all">
          {/* VERIFIED */}
          {isVerified ? (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <MailCheck className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Email Verified Successfully
              </h2>

              <p className="text-md text-neutral-500 leading-relaxed mb-6">
                Your account has been activated successfully.
                <br />
                {loginAfterVerification.isPending
                  ? "Signing you in now..."
                  : "Redirecting you now..."}
              </p>
            </>
          ) : (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
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
              </div>

              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Waiting For Email Verification
              </h2>

              <p className="text-md text-neutral-500 leading-relaxed mb-6">
                We sent a verification link to your email.
                <br />
                Please check your inbox and click the link
                <br />
                to activate your account.
              </p>

              <div className="bg-[#eff4ff] rounded-lg p-4 text-left mb-6">
                <p className="text-sm text-center text-gray-600 leading-relaxed mb-3">
                  Didn't receive it? Check your spam folder or click below
                  <br />
                  to resend.
                </p>

                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className="w-full py-2 px-4 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-blue-600 hover:text-white disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {loading
                    ? "Sending..."
                    : countdown > 0
                      ? `Resend available in ${countdown}s`
                      : "Resend verification email"}
                </button>

                {success && (
                  <p className="mt-3 text-center text-sm text-green-600">
                    {success}
                  </p>
                )}

                {(error || resendError) && (
                  <p className="mt-3 text-center text-sm text-red-600">
                    {error || resendError}
                  </p>
                )}

                {loginError && (
                  <p className="mt-3 text-center text-sm text-red-600">
                    {loginError}
                  </p>
                )}
              </div>
            </>
          )}

          <a
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to login
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
