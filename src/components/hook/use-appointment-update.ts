import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

export type UpdateAppointment = {
  id: number;
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

const updateAppointment = async ({ id, ...payload }: UpdateAppointment) => {
  const res = await api.patch<AppointmentApiResponse>(
    API_ENDPOINT.UPDATE_APPOINTMENT(id),
    payload,
  );

  return res.data;
};

export default function useAppointmentUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointment,

    onMutate: () => {
      const toastId = toast.loading("Updating appointment...");

      return { toastId };
    },

    onSuccess: (response, _variables, context) => {
      toast.success(response.message || "Appointment updated successfully", {
        id: context?.toastId,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.APPOINTMENT],
      });
    },

    onError: (
      error: AxiosError<{ message?: string }>,
      _variables,
      context,
    ) => {
      toast.error(
        error.response?.data?.message || "Failed to update appointment",
        {
          id: context?.toastId,
        },
      );
    },
  });
}
