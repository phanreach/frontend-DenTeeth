import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { COOKIE_KEYS, removeCookie } from "@/utils/cookies";

type LogoutApiResponse = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: null;
};

export default function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await api.patch<LogoutApiResponse>(API_ENDPOINT.LOGOUT);

      return res.data;
    },

    onSuccess: (response) => {
      removeCookie(COOKIE_KEYS.token);
      removeCookie(COOKIE_KEYS.expiration);
      removeCookie(COOKIE_KEYS.username);
      removeCookie(COOKIE_KEYS.email);
      removeCookie(COOKIE_KEYS.roles);
      removeCookie(COOKIE_KEYS.permissions);

      toast.success(response.message);

      navigate("/login", { replace: true });
    },

    onError: (error: unknown) => {
      let message = "Logout failed";

      if (axios.isAxiosError(error)) {
        message =
          (error.response?.data as { message?: string })?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
}
