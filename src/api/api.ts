import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { API_ENDPOINT } from "./endpoint";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

if (!VITE_BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined in environment variables.");
}

const api = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const publicAuthPaths = [API_ENDPOINT.LOGIN, API_ENDPOINT.SIGNUP];
    const isPublicAuthRequest = publicAuthPaths.some((path) =>
      config.url?.includes(path),
    );

    if (!token && !isPublicAuthRequest) {
      return Promise.reject(
        new axios.Cancel("Redirected to login: No auth token"),
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    toast.error(
      (error.response?.data as { message?: string })?.message ||
        "Something went wrong!",
    );

    return Promise.reject(error);
  },
);

export const loginApi = (username: string, password: string) =>
  api.post(API_ENDPOINT.LOGIN, { username, password });

export const meApi = () => api.get(API_ENDPOINT.PROFILE);

export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const response = await axios.post(`${VITE_BASE_URL}/auth/refresh`, {
      refreshToken: token,
    });

    const newAccessToken = response.data?.accessToken;
    if (newAccessToken) {
      Cookies.set("token", newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};

export const logoutApi = () =>
  api.post<{ message: string }>(API_ENDPOINT.LOGOUT);

export default api;
