import { useQuery } from "@tanstack/react-query";
import { getMySessionsApi } from "../../api/api";

export default function useMySessions() {
 return useQuery({
 queryKey: ["my-sessions"],
 queryFn: async () => {
 const response = await getMySessionsApi();
 return response.data;
 },
 });
}
