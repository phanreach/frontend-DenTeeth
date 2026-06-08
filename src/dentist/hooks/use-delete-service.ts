import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteServiceApi } from "../../api/api";
import { toast } from "sonner";

export default function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteServiceApi(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dentist-services"] });
      toast.error(`Service removed successfully`);
    },
  });
}
