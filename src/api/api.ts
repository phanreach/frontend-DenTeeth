import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { API_ENDPOINT } from "./endpoint";
import { COOKIE_KEYS, getCookie, setCookie, clearAuthCookies } from "../utils/cookies";
import type { AppointmentSuccessResponse, GetMyAppointmentsParams, AppointmentStatus, AppointmentRescheduleRequest } from "../dentist/types/appointment";
import type { ServiceCreateRequest, ServiceSuccessResponse, ServiceAdminResponse } from "../dentist/types/service";

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
    const token = getCookie(COOKIE_KEYS.token);
    const publicAuthPaths = [
      API_ENDPOINT.LOGIN,
      API_ENDPOINT.SIGNUP,
      API_ENDPOINT.VERIFY_EMAIL,
      API_ENDPOINT.CHECK_VERIFICATION,
      API_ENDPOINT.RESEND_VERIFICATION,
      API_ENDPOINT.DENTIST,
    ];
    
    // Check if the current request is to a public/auth endpoint
    const isPublicAuthRequest = publicAuthPaths.some((path) =>
      config.url?.includes(path),
    );

    console.log(`[API Request] Method: ${config.method?.toUpperCase()}, URL: ${config.url}, Public: ${isPublicAuthRequest}`);

    // FIX: Only attach the token if it's NOT a public auth request
    // This prevents sending an expired token during the login process
    if (token && !isPublicAuthRequest) {
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
    const status = error.response?.status;
    const data = error.response?.data as { message?: string };
    
    // Auto-logout if token is expired
    if (status === 401 && data?.message?.toLowerCase().includes("expired")) {
      console.warn("[API] Token expired detected. Clearing session.");
      clearAuthCookies();
      // Avoid infinite toast loops
      if (!window.location.pathname.includes("/login")) {
        toast.error("Your session has expired. Please login again.");
        window.location.href = "/login";
      }
    } else {
      toast.error(data?.message || "Something went wrong!");
    }

    return Promise.reject(error);
  },
);

export const loginApi = (username: string, password: string) =>
  api.post(API_ENDPOINT.LOGIN, { username, password });

export const meApi = () => api.get(API_ENDPOINT.PROFILE);

export const getDentistProfileApi = () => api.get(API_ENDPOINT.GET_DENTIST_PROFILE);

export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = getCookie(COOKIE_KEYS.token);
    if (!token) return null;

    const response = await axios.post(`${VITE_BASE_URL}/auth/refresh`, {
      refreshToken: token,
    });

    const newAccessToken = response.data?.accessToken;
    if (newAccessToken) {
      setCookie(COOKIE_KEYS.token, newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};

export const logoutApi = () =>
  api.patch<{ message: string }>(API_ENDPOINT.LOGOUT);

export const getMyAppointmentsApi = (params?: GetMyAppointmentsParams) =>
  api.get<AppointmentSuccessResponse>(API_ENDPOINT.GET_MY_APPOINTMENTS, { params });

export const updateAppointmentStatusApi = (id: number, status: AppointmentStatus) =>
  api.patch(API_ENDPOINT.UPDATE_APPOINTMENT_STATUS(id), null, { params: { status } });

export const rescheduleAppointmentApi = (id: number, data: AppointmentRescheduleRequest) =>
  api.patch(API_ENDPOINT.RESCHEDULE_APPOINTMENT(id), data);

export const getAppointmentStatusApi = () =>
  api.get(API_ENDPOINT.GET_ALL_APPOINTMENTS_STATUS);

export const createServicesApi = (services: ServiceCreateRequest[]) => {
  return api.post<ServiceSuccessResponse>(API_ENDPOINT.CREATE_SERVICE, services);
};

export const getServicesByDentistApi = (dentistId: number) =>
  api.get<ServiceSuccessResponse>(API_ENDPOINT.GET_ALL_SERVICES(dentistId));

export const updateServiceApi = (id: number, data: Partial<ServiceCreateRequest & { status: number }>) =>
  api.patch<ServiceAdminResponse>(API_ENDPOINT.UPDATE_SERVICE(id), data);

export const deleteServiceApi = (id: number) =>
  api.delete<ServiceAdminResponse>(API_ENDPOINT.DELETE_SERVICE(id));

/**
 * The backend might return the URL directly as a string or as an object.
 */
export interface ImageStorageResponse {
  fileName?: string;
  relativePath?: string;
  publicUrl?: string;
  storageType?: string;
  fileSize?: number;
}

export const uploadProfilePhotoApi = (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);
  return api.post<{ success: boolean; data: ImageStorageResponse | string }>(API_ENDPOINT.UPLOAD_PROFILE_PICTURE, formData);
};

export interface DentistProfileUpdateRequest {
  userId?: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  clinicName?: string;
  biography?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
}

export const updateDentistProfileApi = (data: DentistProfileUpdateRequest) =>
  api.patch(API_ENDPOINT.UPDATE_DENTIST_PROFILE, data, { params: data });

export interface OperationHourEntry {
  dayOfWeek: number;
  startAt: string;
  endAt: string;
}

export interface OperationHourRequest {
  hours: OperationHourEntry[];
}

export const createOperationHoursApi = (data: OperationHourRequest) =>
  api.post(API_ENDPOINT.SET_OPERATION_HOURS, data);

export const getOperationHoursApi = (dentistId: number) =>
  api.get(API_ENDPOINT.GET_OPERATION_HOURS(dentistId));

export const deleteProfilePhotoApi = () =>
  api.delete(API_ENDPOINT.DELETE_PROFILE_PICTURE);

export const updateOperationHourApi = (id: number, data: OperationHourEntry) =>
  api.patch(API_ENDPOINT.UPDATE_OPERATION_HOUR(id), data);

export const deleteOperationHourApi = (id: number) =>
  api.delete(API_ENDPOINT.DELETE_OPERATION_HOUR(id));

export const getAppointmentDetailsApi = (id: number) =>
  api.get(API_ENDPOINT.GET_APPOINTMENT_DETAILS(id));

export const getDentistDashboardDataApi = (dateRange: string) =>
  api.get(API_ENDPOINT.GET_DENTIST_DASHBOARD, { params: { dateRange } });

export const getDentistReviewsApi = () =>
  api.get(API_ENDPOINT.GET_DENTIST_REVIEWS);

export const getMySessionsApi = () =>
  api.get(API_ENDPOINT.GET_MY_SESSIONS);

export default api;
