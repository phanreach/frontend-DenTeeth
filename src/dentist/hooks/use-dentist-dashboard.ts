import { useQuery } from "@tanstack/react-query";
import { getDentistDashboardDataApi } from "../../api/api";

export default function useDentistDashboard(dateRange: string) {
 return useQuery({
 queryKey: ["dentist-dashboard", dateRange],
 queryFn: async () => {
 const response = await getDentistDashboardDataApi(dateRange);
 return response.data;
 },
 });
}
