import {
  CalendarClock,
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
import type { Appointment, AppointmentStatus } from "../../dentist/types/calendar";

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
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-blue-50 text-blue-700",
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="text-base font-semibold text-neutral-900">Patient Detail</h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close patient detail"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-4">
            <div
              className={`grid size-14 place-items-center rounded-full text-lg font-bold text-white ${
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
              <p className="text-base font-semibold text-neutral-900">{appointment.patientName}</p>
              <p className="text-xs text-slate-500">
                Age {appointment.age} · Patient ID #{appointment.patientId}
              </p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_BADGE[appointment.status]}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-gray-50 p-3.5">
            <div className="flex items-center gap-2.5 text-sm text-neutral-900">
              <Phone className="size-3.5 text-slate-500" />
              {appointment.phone}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-900">
              <Mail className="size-3.5 text-slate-500" />
              {appointment.email}
            </div>
          </div>

          <div className="space-y-2.5 ">
            <p className="text-xs font-semibold uppercase tracking-tight text-slate-500">
              Appointment Info
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <InfoTile
                icon={<CalendarDays className="size-3 text-slate-500" />}
                label="Date"
                value={selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <InfoTile
                icon={<Clock3 className="size-3 text-slate-500" />}
                label="Time"
                value={appointment.time}
              />
              <InfoTile
                icon={<Stethoscope className="size-3 text-slate-500" />}
                label="Condition"
                value={appointment.service}
              />
              <InfoTile
                icon={<CalendarClock className="size-3 text-slate-500" />}
                label="Type"
                value={appointment.visitType}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-tight text-slate-500">
              Clinical Notes
            </p>
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-neutral-900">
              {appointment.notes}
            </p>
          </div>

          {appointment.status === "pending" ? (
            <div className="space-y-2">
              <button
                onClick={onConfirm}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Confirm Appointment
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onReject}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <CircleX className="size-4" />
                  Reject
                </button>
                <button
                  onClick={onReschedule}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-slate-100 text-sm font-semibold text-slate-500 transition hover:bg-slate-200"
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
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-800"
              >
                Mark Complete
              </button>
              <button
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="h-11 w-full rounded-full bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-800"
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
    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
}
