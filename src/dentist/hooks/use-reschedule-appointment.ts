import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleAppointmentApi } from "../../api/api";
import type { AppointmentRescheduleRequest } from "../types/appointment";
import { toast } from "sonner";

export default function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AppointmentRescheduleRequest }) => {
      const response = await rescheduleAppointmentApi(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentist-appointments"] });
      toast.success("Appointment rescheduled successfully!");
    },
  });
}
