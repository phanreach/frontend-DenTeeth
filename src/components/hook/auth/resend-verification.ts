import { useState } from "react";
import api from "../../../api/api";
import { API_ENDPOINT } from "../../../api/endpoint";
import axios from "axios";

interface ResendVerificationResponse {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: null;
}

export default function useResendVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resendVerification = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await api.post<ResendVerificationResponse>(
        API_ENDPOINT.RESEND_VERIFICATION,
        null,
        {
          params: {
            email,
          },
        },
      );

      setSuccess(response.data.message);

      return response.data;
    } catch (err: unknown) {
      let message = "Failed to resend verification email";

      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string })?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resendVerification,
    loading,
    error,
    success,
  };
}
