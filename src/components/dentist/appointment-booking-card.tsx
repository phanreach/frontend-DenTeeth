import { CalendarDays, Check, Clock3, MoreVertical } from "lucide-react";
import type { AppointmentItem } from "../../dentist/constants/dentist-appointments-data";

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
 const isConfirmed = item.status === "confirmed";

 return (
 <article
 onClick={onOpen}
 className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-4 transition hover:shadow-lg ${
 isPending
 ? "border-indigo-600/20 shadow-indigo-50 "
 : "border-border hover:border-indigo-600/20"
 }`}
 >
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <div className="relative">
 <span
 className={`grid size-11 place-items-center rounded-2xl text-sm font-semibold transition ${
 isPending
 ? "bg-indigo-600 text-white "
 : "bg-muted text-muted-foreground"
 }`}
 >
 {item.initials}
 </span>
 {isConfirmed && (
 <div className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-[10px] text-white ring-2 ring-card">
 <Check className="size-2.5 stroke-[4px]" />
 </div>
 )}
 </div>
 <div>
 <p className="text-sm font-semibold text-foreground">{item.name}</p>
 <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide opacity-70">
 {item.patientId} • {item.age} Years
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span
 className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
 isPending
 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
 : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
 }`}
 >
 {item.status}
 </span>
 <button className="grid size-7 place-items-center rounded-full text-muted-foreground/40 transition hover:bg-muted hover:text-muted-foreground">
 <MoreVertical className="size-4" />
 </button>
 </div>
 </div>

 <div className="mt-4 rounded-xl bg-muted/50 p-3 ring-1 ring-border">
 <p className="text-xs font-semibold text-indigo-600 ">{item.service}</p>
 <div className="mt-2 flex items-center gap-4 text-[11px] font-medium text-muted-foreground/80">
 <span className="inline-flex items-center gap-1.5">
 <CalendarDays className="size-3.5 opacity-70" />
 {item.date}
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Clock3 className="size-3.5 opacity-70" />
 {item.time}
 </span>
 </div>
 </div>

 {item.note && (
 <p className="mt-3 line-clamp-1 text-[11px] italic text-muted-foreground/60">"{item.note}"</p>
 )}

 {isPending ? (
 <div className="mt-4 flex gap-2">
 <button
 onClick={(event) => {
 event.stopPropagation();
 onConfirm();
 }}
 className="flex-1 h-9 cursor-pointer rounded-xl bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-600 active:scale-95 "
 >
 Confirm
 </button>
 <button
 onClick={(event) => {
 event.stopPropagation();
 onReject();
 }}
 className="h-9 w-20 cursor-pointer rounded-xl bg-rose-50 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
 >
 Reject
 </button>
 <button
 onClick={(event) => {
 event.stopPropagation();
 onMove();
 }}
 className="grid h-9 w-11 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80 active:scale-95"
 >
 <Clock3 className="size-4" />
 </button>
 </div>
 ) : (
 <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
 <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
 <Check className="size-3.5 stroke-[3px]" /> Confirmed
 </p>
 <button className="text-[11px] font-semibold text-indigo-600 hover:underline ">
 View Details
 </button>
 </div>
 )}
 </article>
 );
}
