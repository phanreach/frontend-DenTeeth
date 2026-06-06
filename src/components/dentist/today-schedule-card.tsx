import type { DentistAppointment } from "../../dentist/constants/dashboard-data";

interface TodayScheduleCardProps {
  dateLabel: string;
  appointments: DentistAppointment[];
}

export default function TodayScheduleCard({
  dateLabel,
  appointments,
}: TodayScheduleCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Today's Schedule</h3>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{dateLabel}</p>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="group cursor-pointer rounded-2xl border border-border bg-muted/30 p-4 transition hover:border-indigo-600/20 hover:bg-muted/50 dark:hover:border-indigo-500/30">
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/10 text-xs font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                {appointment.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{appointment.patient}</p>
                <p className="truncate text-[11px] font-medium text-muted-foreground/60">{appointment.condition}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{appointment.time}</p>
                <p
                  className={`mt-0.5 text-[10px] font-black uppercase tracking-wider ${
                    appointment.status === "pending"
                      ? "text-amber-500"
                      : appointment.status === "rescheduled"
                        ? "text-orange-500"
                        : "text-emerald-500"
                  }`}
                >
                  {appointment.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
