import { MailCheck, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/nav-bar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import checkVerification from "../components/hook/auth/check-verification";

export default function VerifyEmail() {
  const [resent, setResent] = useState(false);

  const navigate = useNavigate();

  const email = Cookies.get("email");
  const roles = Cookies.get("roles");

  const { data } = useQuery({
    queryKey: ["check-verification", email],
    queryFn: () => checkVerification(email || ""),
    enabled: !!email,
    refetchInterval: (query) => {
      console.log("Polling response:", query.state.data);
      const verified = query.state.data?.data;
      return verified ? false : 3000;
    },
  });
  console.log("email from cookie:", email);
  useEffect(() => {
    if (data?.data === true) {
      setTimeout(() => {
        if (roles?.includes("ADMIN")) {
          navigate("/admin/dashboard");
        } else if (roles?.includes("DENTIST")) {
          navigate("/dentist/dashboard");
        } else {
          navigate("/home");
        }
      }, 1200);
    }
  }, [data, roles, navigate]);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => {
      setResent(false);
    }, 3000);
  };

  const isVerified = data?.data === true;

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
                Redirecting you now...
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
                  disabled={resent}
                  className="w-full py-2 px-4 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-blue-600 hover:text-white disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {resent ? "Sent!" : "Resend verification email"}
                </button>
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
