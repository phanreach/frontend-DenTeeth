import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

export type AppointmentPayload = {
  dentistId: number;
  serviceId: number;
  hourId: number;
  appointmentDate: string;
  remarks: string;
};

type AppointmentApiResponse<T = unknown> = {
  success: boolean;
  code?: string;
  status: number;
  message: string;
  data: T;
};

export default function useAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AppointmentPayload) => {
      const res = await api.post<AppointmentApiResponse>(
        API_ENDPOINT.CREATE_APPOINTMENT,
        payload,
      );
      return res.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Creating appointment...");
      return { toastId };
    },

    onSuccess: (response, _variables, context) => {
      toast.success(response.message || "Appointment booked successfully", {
        id: context?.toastId,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.APPOINTMENT],
      });
    },

    onError: (_error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}
