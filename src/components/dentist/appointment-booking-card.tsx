import { CalendarDays, Check, Clock3 } from "lucide-react";
import type { AppointmentItem } from "../constants/dentist-appointments-data";

interface AppointmentBookingCardProps {
  item: AppointmentItem;
  onOpen: () => void;
  onConfirm: () => void;
  onReject: () => void;
  onMove: () => void;
}

export default function AppointmentBookingCard({
  item,
  onOpen,
  onConfirm,
  onReject,
  onMove,
}: AppointmentBookingCardProps) {
  const isPending = item.status === "pending";

  return (
    <article
      onClick={onOpen}
      className={`cursor-pointer rounded-2xl border border-black/10 border-l-4 bg-white p-4 ${isPending ? "border-l-yellow-500" : "border-l-emerald-500"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-full text-sm font-bold ${isPending ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
            {item.initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
            <p className="text-xs text-slate-500">Age {item.age}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${isPending ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
          {item.status}
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-teal-600">{item.service}</p>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{item.date}</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{item.time}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{item.note}</p>

      {isPending ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onConfirm();
            }}
            className="h-8 rounded-2xl bg-emerald-600 text-xs font-semibold text-white"
          >
            Confirm
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onReject();
            }}
            className="h-8 rounded-2xl bg-red-50 text-xs font-semibold text-red-600"
          >
            Reject
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onMove();
            }}
            className="h-8 rounded-2xl bg-slate-100 text-xs font-semibold text-slate-500"
          >
            Move
          </button>
        </div>
      ) : (
        <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <Check className="size-3.5" /> Confirmed - patient notified
        </p>
      )}
    </article>
  );
}
