import { useQuery } from "@tanstack/react-query";
import { getMyAppointmentsApi } from "../../api/api";
import type { GetMyAppointmentsParams } from "../types/appointment";

export default function useMyAppointments(params?: GetMyAppointmentsParams) {
  return useQuery({
    queryKey: ["dentist-appointments", params],
    queryFn: async () => {
      const response = await getMyAppointmentsApi(params);
      return response.data.data;
    },
  });
}
