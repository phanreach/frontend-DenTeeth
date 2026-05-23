export type service = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: string;
  imageUrl: string;
};

export type operationHours = {
  id: number;
  status: boolean;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
};

export type dentist = {
  id: number;
  name: string;
  gender: string;
  photoUrl: string;
  biography: string;
  clinicName: string;
  profession: string;
  yearsOfExperience: number;
  priceRange: string[];
  specialty: string;
  rating: string;
  address: string;
  hours: string;
  availability: string;
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
  appointmentDate: string;
  price: number;
  patientName: string;
  dentistName: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  remarks: string;
};
