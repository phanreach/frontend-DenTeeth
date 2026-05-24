export type AppointmentStatus = "confirmed" | "pending";

export interface OverviewCardData {
  title: string;
  kind: "next" | "action" | "week";
  value?: string;
  subtitle?: string;
  meta?: string;
}

export interface DateChipData {
  dayLabel: string;
  dayNumber: string;
  appointments: number;
  active?: boolean;
  hasDot?: boolean;
}

export interface AppointmentItem {
  id: string;
  initials: string;
  name: string;
  patientId: string;
  age: number;
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  visitType: "In-clinic visit" | "Teleconsultation";
  note: string;
  status: AppointmentStatus;
}

export const APPOINTMENTS_PAGE_DATA = {
  heading: {
    eyebrow: "Bookings",
    title: "Appointments",
    dateLabel: "Saturday, 24 May 2026",
  },
  overviewCards: [
    {
      title: "Next Up",
      kind: "next",
      value: "Lucas Ferreira",
      subtitle: "Dental X-Ray Review",
      meta: "May 27, 2026 • 01:00 PM",
    },
    {
      title: "Needs Action",
      kind: "action",
      value: "8",
      subtitle: "Oldest: Tom Nguyen · May 8, 2026",
    },
    {
      title: "This Week",
      kind: "week",
      value: "7 appts",
      subtitle: "M T W T F S",
    },
  ] as OverviewCardData[],
  tabs: [
    { key: "all", label: "All", count: 24 },
    { key: "pending", label: "Pending", count: 8 },
    { key: "confirmed", label: "Confirmed", count: 13 },
    { key: "completed", label: "Completed", count: 3 },
    { key: "rejected", label: "Rejected", count: 0 },
  ],
  dateChips: [
    { dayLabel: "All", dayNumber: "", appointments: 24 },
    { dayLabel: "Tue", dayNumber: "5", appointments: 2 },
    { dayLabel: "Thu", dayNumber: "7", appointments: 2 },
    { dayLabel: "Fri", dayNumber: "8", appointments: 3, active: true },
    { dayLabel: "Tue", dayNumber: "12", appointments: 2, hasDot: true },
    { dayLabel: "Wed", dayNumber: "13", appointments: 1, hasDot: true },
    { dayLabel: "Thu", dayNumber: "14", appointments: 2, hasDot: true },
  ] as DateChipData[],
  appointments: [
    {
      id: "apt-1",
      initials: "ER",
      name: "Emily Ross",
      patientId: "A8",
      age: 24,
      service: "Invisalign Consultation",
      date: "May 8, 2026",
      time: "03:00 PM",
      phone: "+1 (212) 555-0108",
      email: "emily.r@email.com",
      visitType: "In-clinic visit",
      note: "Interested in clear aligner treatment.",
      status: "confirmed",
    },
    {
      id: "apt-2",
      initials: "PN",
      name: "Priya Nair",
      patientId: "A6",
      age: 38,
      service: "Gum Inflammation",
      date: "May 8, 2026",
      time: "09:30 AM",
      phone: "+1 (212) 555-0106",
      email: "priya.n@email.com",
      visitType: "In-clinic visit",
      note: "Moderate gingivitis, ongoing treatment.",
      status: "confirmed",
    },
    {
      id: "apt-3",
      initials: "TN",
      name: "Tom Nguyen",
      patientId: "A7",
      age: 31,
      service: "Routine Checkup",
      date: "May 8, 2026",
      time: "11:00 AM",
      phone: "+1 (212) 555-0107",
      email: "tom.ng@email.com",
      visitType: "In-clinic visit",
      note: "First visit at this clinic.",
      status: "pending",
    },
  ] as AppointmentItem[],
};
