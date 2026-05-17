import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINT } from "../../../api/endpoint";
import api from "../../../api/api";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { COOKIE_KEYS, setCookie } from "../../../utils/cookies";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  userId: number;
  username: string;
  expiration: string;
  email: string;
  firstLogin: boolean;
  roles: string[];
  permissions: string[];
};

export type LoginApiResponse = {
  success: boolean;
  status: number;
  message: string;
  data: LoginResponse;
};

export default function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post<LoginApiResponse>(API_ENDPOINT.LOGIN, payload);
      return res.data;
    },

    onSuccess: (response: LoginApiResponse) => {
      const data = response.data;

      setCookie(COOKIE_KEYS.token, data.token);
      setCookie(COOKIE_KEYS.username, data.username);
      setCookie(COOKIE_KEYS.roles, data.roles.join(","));
      setCookie(COOKIE_KEYS.email, data.email);
      setCookie(COOKIE_KEYS.permissions, data.permissions.join(","));

      toast.success(response.message);

      if (data.roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (data.roles.includes("DENTIST")) {
        navigate("/dentist/dashboard");
      } else {
        navigate("/home");
      }
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string })?.message ||
          "Login failed!";
        console.error("Login error:", message);
      }
    },
  });
}
