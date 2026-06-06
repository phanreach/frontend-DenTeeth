import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";
import axios from "axios";

const deleteAppointment = async (id: number) => {
  const res = await api.delete(API_ENDPOINT.DELETE_APPOINTMENT(id));
  return res.data;
};

export default function useAppointmentDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAppointment,

    onMutate: () => {
      const toastId = toast.loading("Deleting appointment...");
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.APPOINTMENT],
      });

      toast.dismiss(context?.toastId);
      toast.success("Appointment deleted successfully");
    },

    onError: (error: unknown, _, context) => {
      toast.dismiss(context?.toastId);

      let message = "Delete failed";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
}
