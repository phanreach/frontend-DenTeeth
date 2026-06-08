import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusApi } from "../../api/api";
import type { AppointmentStatus } from "../types/appointment";
import { toast } from "sonner";

export default function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: AppointmentStatus }) => {
      const response = await updateAppointmentStatusApi(id, status);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dentist-appointments"] });
      toast.success(`Appointment status updated to ${variables.status.toLowerCase()}.`);
    },
  });
}
