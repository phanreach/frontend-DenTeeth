import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import {
 APPOINTMENTS_PAGE_DATA,
 type AppointmentItem,
} from "../constants/dentist-appointments-data";

const STORAGE_KEY = "denteeth.dentist.appointments";
const APPOINTMENTS_CHANGED_EVENT = "denteeth:dentist-appointments-changed";

function isAppointmentList(value: unknown): value is AppointmentItem[] {
 return (
 Array.isArray(value) &&
 value.every(
 (item) =>
 item &&
 typeof item === "object" &&
 "id" in item &&
 "status" in item,
 )
 );
}

function readAppointments(): AppointmentItem[] {
 if (typeof window === "undefined") {
 return APPOINTMENTS_PAGE_DATA.appointments;
 }

 try {
 const saved = window.localStorage.getItem(STORAGE_KEY);
 if (!saved) return APPOINTMENTS_PAGE_DATA.appointments;

 const parsed = JSON.parse(saved);
 return isAppointmentList(parsed) ? parsed : APPOINTMENTS_PAGE_DATA.appointments;
 } catch {
 return APPOINTMENTS_PAGE_DATA.appointments;
 }
}

function writeAppointments(appointments: AppointmentItem[]) {
 window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
 window.dispatchEvent(
 new CustomEvent<AppointmentItem[]>(APPOINTMENTS_CHANGED_EVENT, {
 detail: appointments,
 }),
 );
}

export function getPendingDentistAppointmentCount(appointments: AppointmentItem[]) {
 return appointments.filter((appointment) => appointment.status === "pending").length;
}

export default function useDentistAppointments() {
 const [appointments, setAppointmentsState] = useState<AppointmentItem[]>(readAppointments);
 const appointmentsRef = useRef(appointments);

 useEffect(() => {
 const handleAppointmentsChanged = (event: Event) => {
 const detail = (event as CustomEvent<AppointmentItem[]>).detail;
 if (isAppointmentList(detail)) {
 appointmentsRef.current = detail;
 setAppointmentsState(detail);
 }
 };

 const handleStorage = (event: StorageEvent) => {
 if (event.key === STORAGE_KEY) {
 const nextAppointments = readAppointments();
 appointmentsRef.current = nextAppointments;
 setAppointmentsState(nextAppointments);
 }
 };

 window.addEventListener(APPOINTMENTS_CHANGED_EVENT, handleAppointmentsChanged);
 window.addEventListener("storage", handleStorage);

 return () => {
 window.removeEventListener(APPOINTMENTS_CHANGED_EVENT, handleAppointmentsChanged);
 window.removeEventListener("storage", handleStorage);
 };
 }, []);

 const setAppointments = useCallback((update: SetStateAction<AppointmentItem[]>) => {
 const nextAppointments =
 typeof update === "function" ? update(appointmentsRef.current) : update;

 appointmentsRef.current = nextAppointments;
 setAppointmentsState(nextAppointments);
 writeAppointments(nextAppointments);
 }, []);

 return [appointments, setAppointments] as const;
}
