import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

export type appointmentPayload = {
  dentistId: number;
  serviceId: number;
  hourId: number;
  appointmentDate: string;
  remarks: string;
};

export default function useAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: appointmentPayload) => {
      const res = await api.post(API_ENDPOINT.CREATE_APPOINTMENT, payload);
      return res.data.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Create Appointment...");
      return { toastId };
    },

    onSuccess: ({ toastId }) => {
      toast.dismiss(toastId);
      toast.success("Project added successfully", { id: toastId });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.APPOINTMENT],
      });
    },
  });
}
