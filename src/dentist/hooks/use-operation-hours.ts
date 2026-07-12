import { useQuery } from "@tanstack/react-query";
import { getOperationHoursApi } from "../../api/api";

export default function useOperationHours(dentistId: number | undefined) {
 return useQuery({
 queryKey: ["operation-hours", dentistId],
 queryFn: async () => {
 if (!dentistId) return null;
 const response = await getOperationHoursApi(dentistId);
 return response.data.data;
 },
 enabled: !!dentistId,
 });
}
