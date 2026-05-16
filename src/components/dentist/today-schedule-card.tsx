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
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold leading-5 text-neutral-900">Today's Schedule</h3>
        <p className="text-xs text-slate-500">{dateLabel}</p>
      </div>

      <div className="space-y-2">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="rounded-2xl bg-slate-100/50 p-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-indigo-700">
                {appointment.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{appointment.patient}</p>
                <p className="truncate text-xs text-slate-500">{appointment.condition}</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-neutral-900">{appointment.time}</p>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs capitalize ${
                    appointment.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : appointment.status === "rescheduled"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
