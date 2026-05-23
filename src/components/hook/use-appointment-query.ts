import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";
import type { AppointmentData } from "@/types/api";

export type AppointmentFilter = {
  status?: AppointmentData["status"];
  dateFrom?: string;
  dateTo?: string;
};

type AppointmentApiResponse = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: AppointmentData[];
};

const cleanFilter = (filter?: AppointmentFilter) => {
  if (!filter) return undefined;

  const payload = Object.fromEntries(
    Object.entries(filter).filter(([, value]) => Boolean(value)),
  ) as AppointmentFilter;

  return Object.keys(payload).length > 0 ? payload : undefined;
};

export default function useAppointmentQuery(filter?: AppointmentFilter) {
  const payload = cleanFilter(filter);

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.APPOINTMENT, payload],
    queryFn: async () => {
      const res = await api.get<AppointmentApiResponse>(
        API_ENDPOINT.GET_PATIENT_APPOINTMENTS,
        payload ? { data: payload } : undefined,
      );

      return res.data.data ?? [];
    },
  });
}
