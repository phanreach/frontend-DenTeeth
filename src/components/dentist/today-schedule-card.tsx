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
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Today's Schedule</h3>
        <p className="text-sm font-medium text-slate-400">{dateLabel}</p>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100/80">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-700/10 text-xs font-bold text-indigo-700">
                {appointment.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-slate-900">{appointment.patient}</p>
                <p className="truncate text-xs font-medium text-slate-400">{appointment.condition}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{appointment.time}</p>
                <p
                  className={`mt-0.5 text-xs font-bold capitalize ${
                    appointment.status === "pending"
                      ? "text-orange-400"
                      : appointment.status === "rescheduled"
                        ? "text-orange-500"
                        : "text-emerald-500"
                  }`}
                >
                  {appointment.status}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
