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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dentist-profile"] });
      toast.success(data.message || "Profile photo uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    }
  });
}
