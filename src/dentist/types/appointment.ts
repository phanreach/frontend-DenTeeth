export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED" | "RESCHEDULED";

export interface AppointmentData {
  id: number;
  appointmentDate: string; // yyyy-MM-dd
  price: number;
  patientName: string;
  dentistName: string;
  serviceName: string;
  startAt: string; // HH:mm:ss
  endAt: string; // HH:mm:ss
  status: AppointmentStatus;
  remarks: string | null;
}

export interface AppointmentRescheduleRequest {
  hourId: number;
  appointmentDate: string; // yyyy-MM-dd
}

export interface GetMyAppointmentsParams {
  status?: AppointmentStatus;
  dateFrom?: string; // yyyy-MM-dd
  dateTo?: string; // yyyy-MM-dd
}

export interface AppointmentSuccessResponse {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: AppointmentData[];
}
