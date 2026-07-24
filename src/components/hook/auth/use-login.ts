import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINT } from "../../../api/endpoint";
import api from "../../../api/api";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  navigateToHomeForRoles,
  saveAuthSession,
} from "../../../utils/auth-session";

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

      saveAuthSession(data);

      toast.success(response.message);

      navigateToHomeForRoles(navigate, data.roles);
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
