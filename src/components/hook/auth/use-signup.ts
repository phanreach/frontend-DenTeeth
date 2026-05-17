import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../../api/endpoint";
import api from "../../../api/api";
import { COOKIE_KEYS, setCookie } from "../../../utils/cookies";
import { toast } from "sonner";
import axios from "axios";

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  roleId: number;
};

export type SignupResponse = {
  token: string | null;
  expiration: string | null;
  userId: number;
  username: string;
  email: string;
  firstLogin: boolean;
  roles: string[];
  permissions: string[];
};

export type SignupApi = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: SignupResponse;
};

export default function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const res = await api.post<SignupApi>(API_ENDPOINT.SIGNUP, payload);

      return res.data;
    },

    onSuccess: (response: SignupApi) => {
      const data = response.data;

      if (data.token) {
        setCookie(COOKIE_KEYS.token, data.token);
      }

      if (data.expiration) {
        setCookie(COOKIE_KEYS.expiration, data.expiration);
      }

      setCookie(COOKIE_KEYS.username, data.username);
      setCookie(COOKIE_KEYS.roles, data.roles.join(","));
      setCookie(COOKIE_KEYS.email, data.email);
      setCookie(COOKIE_KEYS.permissions, data.permissions.join(","));
      toast.success(response.message);

      navigate("/verify-email");
    },

    onError: (error: unknown) => {
      let message = "Failed to signup";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("Signup error:", error);

      toast.error(message);
    },
  });
}
