import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateServiceApi } from "../../api/api";
import type { ServiceCreateRequest } from "../types/service";
import { toast } from "sonner";

export default function useUpdateService() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async ({ id, data }: { id: number; data: Partial<ServiceCreateRequest & { status: number }> }) => {
 const response = await updateServiceApi(id, data);
 return response.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["dentist-services"] });
 toast.success(`Service updated successfully`);
 },
 });
}
