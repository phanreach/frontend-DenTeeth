import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServicesApi } from "../../api/api";
import type { ServiceCreateRequest } from "../types/service";
import { toast } from "sonner";

export default function useCreateServices() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (services: ServiceCreateRequest[]) => {
 console.log("[useCreateServices] Calling API with:", services);
 const response = await createServicesApi(services);
 console.log("[useCreateServices] API Response:", response.data);
 return response.data;
 },
 onSuccess: (data) => {
 console.log("[useCreateServices] Success, invalidating queries...");
 queryClient.invalidateQueries({ queryKey: ["dentist-services"] });
 toast.success(data.message || "Dental services created successfully");
 },
 onError: (error) => {
 console.error("[useCreateServices] Mutation Error:", error);
 }
 });
}
