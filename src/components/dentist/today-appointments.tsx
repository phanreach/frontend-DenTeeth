import type { DentistAppointment } from "../../dentist/constants/dashboard-data";

interface TodayAppointmentsProps {
  appointments: DentistAppointment[];
}

export default function TodayAppointments({
  appointments,
}: TodayAppointmentsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Today Appointments</h2>
        <span className="rounded-full bg-[#4845d2]/10 px-3 py-1 text-xs font-bold text-[#4845d2]">
          {appointments.length} total
        </span>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <article
            key={appointment.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4845d2] text-sm font-bold text-white">
                {appointment.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {appointment.patient}
                </p>
                <p className="truncate text-xs text-slate-500">{appointment.condition}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  appointment.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">{appointment.time}</p>
              <div className="flex gap-2">
                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                  Reschedule
                </button>
                <button className="rounded-xl bg-[#4845d2] px-3 py-2 text-xs font-bold text-white">
                  Confirm
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
