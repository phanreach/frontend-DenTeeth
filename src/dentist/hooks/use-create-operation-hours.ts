import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOperationHoursApi, type OperationHourRequest } from "../../api/api";
import { toast } from "sonner";

export default function useCreateOperationHours() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (data: OperationHourRequest) => {
 const response = await createOperationHoursApi(data);
 return response.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 queryClient.invalidateQueries({ queryKey: ["operation-hours"] });
 toast.success("Operation hours saved successfully");
 },
 });
}
