import {
 CalendarDays,
 CircleX,
 Clock3,
 Mail,
 Phone,
 RotateCcw,
 Stethoscope,
 X,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Appointment, AppointmentStatus } from "../../dentist/types/ui-appointment";

interface AppointmentDetailModalProps {
 appointment: Appointment | null;
 selectedDate: Date;
 onClose: () => void;
 onConfirm: () => void;
 onReject: () => void;
 onReschedule: () => void;
 onMarkComplete: () => void;
}

const STATUS_BADGE: Record<AppointmentStatus, string> = {
 pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
 confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
 completed: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
};

export default function AppointmentDetailModal({
 appointment,
 selectedDate,
 onClose,
 onConfirm,
 onReject,
 onReschedule,
 onMarkComplete,
}: AppointmentDetailModalProps) {
 if (!appointment) return null;

 return (
 <div
 className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
 onClick={onClose}
 >
 <div
 className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
 onClick={(event) => event.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-border px-5 py-4">
 <h3 className="text-base font-semibold text-foreground">Patient Detail</h3>
 <button
 onClick={onClose}
 className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80"
 aria-label="Close patient detail"
 >
 <X className="size-4" />
 </button>
 </div>

 <div className="space-y-5 p-5">
 <div className="flex items-center gap-4">
 <div
 className={`grid size-14 place-items-center rounded-full text-lg font-semibold text-white ${
 appointment.status === "confirmed"
 ? "bg-emerald-500"
 : appointment.status === "pending"
 ? "bg-amber-500"
 : "bg-blue-400"
 }`}
 >
 {appointment.initials}
 </div>
 <div>
 <p className="text-base font-semibold text-foreground">{appointment.patientName}</p>
 <p className="text-xs text-muted-foreground">
 Age {appointment.age} · Patient ID #{appointment.patientId}
 </p>
 <span
 className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE[appointment.status]}`}
 >
 {appointment.status}
 </span>
 </div>
 </div>

 <div className="space-y-2 rounded-xl bg-muted/50 p-3.5 ring-1 ring-border">
 <div className="flex items-center gap-2.5 text-sm text-foreground">
 <Phone className="size-3.5 text-muted-foreground" />
 {appointment.phone}
 </div>
 <div className="flex items-center gap-2.5 text-sm text-foreground">
 <Mail className="size-3.5 text-muted-foreground" />
 {appointment.email}
 </div>
 </div>

 <div className="space-y-2.5 ">
 <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Appointment Info
 </p>
 <div className="grid grid-cols-2 gap-2.5">
 <InfoTile
 icon={<CalendarDays className="size-3 text-muted-foreground" />}
 label="Date"
 value={selectedDate.toLocaleDateString("en-US", {
 month: "short",
 day: "numeric",
 year: "numeric",
 })}
 />
 <InfoTile
 icon={<Clock3 className="size-3 text-muted-foreground" />}
 label="Time"
 value={appointment.time}
 />
 <InfoTile
 icon={<Stethoscope className="size-3 text-muted-foreground" />}
 label="Condition"
 value={appointment.service}
 />
 <InfoTile
 icon={<div className="text-[10px] font-semibold text-muted-foreground">$</div>}
 label="Price"
 value={`$${appointment.price}`}
 />
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Clinical Notes
 </p>
 <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground leading-relaxed italic border border-border">
 "{appointment.notes}"
 </p>
 </div>

 {appointment.status === "pending" ? (
 <div className="space-y-2">
 <button
 onClick={onConfirm}
 className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-95 "
 >
 Confirm Appointment
 </button>
 <div className="grid grid-cols-2 gap-2">
 <button
 onClick={onReject}
 className="flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95 dark:bg-rose-950/20 dark:text-rose-400"
 >
 <CircleX className="size-4" />
 Reject
 </button>
 <button
 onClick={onReschedule}
 className="flex h-11 items-center justify-center gap-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-95"
 >
 <RotateCcw className="size-4" />
 Reschedule
 </button>
 </div>
 </div>
 ) : appointment.status === "confirmed" ? (
 <div className="grid grid-cols-2 gap-2">
 <button
 onClick={onMarkComplete}
 className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-95 "
 >
 Mark Complete
 </button>
 <button
 onClick={onClose}
 className="flex h-11 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-95"
 >
 Close
 </button>
 </div>
 ) : (
 <button
 onClick={onClose}
 className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-95 "
 >
 Close
 </button>
 )}
 </div>
 </div>
 </div>
 );
}

function InfoTile({
 icon,
 label,
 value,
}: {
 icon: ReactNode;
 label: string;
 value: string;
}) {
 return (
 <div className="rounded-xl bg-muted/50 px-3 py-2.5 ring-1 ring-border">
 <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 {icon}
 {label}
 </p>
 <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{value}</p>
 </div>
 );
}
