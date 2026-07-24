export type service = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  orderIndex?: number;
  imageUrl: string | null;
};

export type operationHours = {
  id: number;
  status: boolean | null;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
};

export type dentist = {
  id: number;
  name: string;
  gender: string | null;
  photoUrl: string | null;
  biography: string | null;
  clinicName: string | null;
  profession: string | null;
  yearsOfExperience: number | null;
  priceRange: number[];
  specialty?: string;
  rating?: string;
  address?: string;
  hours?: string;
  availability?: string;
  services: service[];
  operationHours: operationHours[];
};

export type history = {
  id: number;
};

export type AppointmentStatus = "Completed" | "Cancelled" | "Pending";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  dentist: string;
  service: string;
  status: AppointmentStatus;
};

export type AppointmentData = {
  id: number;
  dentistId?: number;
  serviceId?: number;
  hourId?: number;
  appointmentDate: string;
  price: number;
  patientName: string;
  dentistName: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED" | "CONFIRMED";
  remarks: string;
};

export type Disease = {
  id: number;
  name: string;
  description: string;
  symptoms: string;
  causes: string;
  treatment: string;
  prevention: string;
};

export type DiagnosisFinding = {
  className: string;
  diseaseId: number;
  coveragePct: number;
};

export type Diagnosis = {
  diagnosisId: number;

  imageUrl: string;

  overlayUrl: string;

  findings: DiagnosisFinding[];

  diseases: Disease[];

  createdAt: string;
};
