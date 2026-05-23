import { z } from "zod";

export const appointmentSchema = z.object({
  dentistId: z.coerce.number().int().positive("Dentist is required"),
  serviceId: z.coerce.number().int().positive("Please select a service."),
  hourId: z.coerce.number().int().positive("Please select a time slot."),
  appointmentDate: z
    .string()
    .min(1, "Please select an appointment date.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Appointment date must be YYYY-MM-DD."),
  remarks: z.string().max(500, "Remarks must be 500 characters or less."),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
