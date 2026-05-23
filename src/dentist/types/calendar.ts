export type AppointmentStatus = "pending" | "confirmed" | "completed";

export interface Appointment {
  id: string;
  patientName: string;
  initials: string;
  service: string;
  time: string;
  status: AppointmentStatus;
  age: number;
  patientId: string;
  phone: string;
  email: string;
  visitType: "In-clinic visit" | "Teleconsultation";
  notes: string;
}
