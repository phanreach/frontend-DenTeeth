import { useQuery } from "@tanstack/react-query";
import { getOperationHoursApi } from "../../api/api";

export default function useOperationHours(dentistId: number | undefined) {
 return useQuery({
 queryKey: ["operation-hours", dentistId],
 queryFn: async () => {
 if (!dentistId) return null;
  const response = await getOperationHoursApi(dentistId);
 const rawData = response.data;
 if (Array.isArray(rawData)) return rawData;
 if (rawData && Array.isArray(rawData.data)) return rawData.data;
 if (rawData && rawData.data && Array.isArray(rawData.data.hours)) return rawData.data.hours;
 if (rawData && rawData.data && Array.isArray(rawData.data.operationHours)) return rawData.data.operationHours;
 return rawData;
 },
 enabled: !!dentistId,
 });
}
