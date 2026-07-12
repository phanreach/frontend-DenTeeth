import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDentistProfileApi, type DentistProfileUpdateRequest } from "../../api/api";
import { toast } from "sonner";

export default function useUpdateProfile() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (data: DentistProfileUpdateRequest) => {
 const response = await updateDentistProfileApi(data);
 return response.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 toast.success("Profile updated successfully");
 },
 });
}
