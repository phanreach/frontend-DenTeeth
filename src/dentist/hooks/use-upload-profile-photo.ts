import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePhotoApi } from "../../api/api";
import { toast } from "sonner";

export default function useUploadProfilePhoto() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (photo: File) => {
 const response = await uploadProfilePhotoApi(photo);
 return response.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["dentist-profile"] });
 toast.success("Profile photo uploaded successfully");
 },
 onError: (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
 toast.error(error.response?.data?.message || "Failed to upload photo");
 }
 });
}
