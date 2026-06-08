import { useQuery } from "@tanstack/react-query";
import { getServicesByDentistApi } from "../../api/api";

export default function useDentistServices(dentistId?: number) {
  return useQuery({
    queryKey: ["dentist-services", dentistId],
    queryFn: async () => {
      if (!dentistId) {
        console.warn("[useDentistServices] No dentistId provided, skipping fetch.");
        return [];
      }
      console.log("[useDentistServices] Fetching for dentistId:", dentistId);
      const response = await getServicesByDentistApi(dentistId);
      console.log("[useDentistServices] Fetched items:", response.data.data.length);
      return response.data.data;
    },
    enabled: !!dentistId,
  });
}
