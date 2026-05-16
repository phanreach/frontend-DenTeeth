import { useMemo, useState } from "react";
import { AlertCircle, Calendar, LogOut, Star, Users } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import KpiCard from "../../components/dentist/kpi-card";
import PeriodTabs from "../../components/dentist/period-tabs";
import AppointmentsChart from "../../components/dentist/appointments-chart";
import StatusSplitCard from "../../components/dentist/status-split-card";
import ThisWeekCard from "../../components/dentist/this-week-card";
import TopConditionsCard from "../../components/dentist/top-conditions-card";
import RevenueCard from "../../components/dentist/revenue-card";
import TodayScheduleCard from "../../components/dentist/today-schedule-card";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import {
  MOBILE_WEEK_LABELS,
  MOBILE_WEEK_POINTS,
  PERIOD_DATA,
  TODAY_APPOINTMENTS,
  TOP_CONDITIONS,
  type AnalyticsPeriod,
} from "../constants/dashboard-data";

export default function Dashboard() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const navigate = useNavigate();

  const username = Cookies.get("username") || "Dr. Miller";
  const data = useMemo(() => PERIOD_DATA[period], [period]);
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("expiration");
    Cookies.remove("role");
    Cookies.remove("roles");
    Cookies.remove("username");
    Cookies.remove("email");
    Cookies.remove("permissions");
    navigate("/login");
  };

  return (
    <main className="mx-auto w-full max-w-[1134px] space-y-4 pb-24 lg:px-0 lg:pb-8">
      <section className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-teal-600">
            Dentist Dashboard
          </p>
          <h1
            className="text-4xl font-bold leading-8 text-neutral-900 mt-1"
            style={{ fontFamily: "'Fraunces', 'DM Serif Display', Georgia, serif" }}
          >
            {username}
          </h1>
          <p className="mt-2 text-xs text-slate-500">May 2026</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </section>

      <PeriodTabs value={period} onChange={setPeriod} />

      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <KpiCard
          title="Total Appointments"
          value={String(data.kpi.appointments)}
          subtitle="+9% vs last period"
          icon={Calendar}
          featured
        />
        <KpiCard
          title="Treated Patients"
          value={String(data.kpi.treated)}
          subtitle="3 confirmed"
          icon={Users}
        />
        <KpiCard
          title="Pending Actions"
          value={String(data.kpi.pending)}
          subtitle="Need your response"
          icon={AlertCircle}
        />
        <KpiCard
          title="Avg. Satisfaction"
          value={data.kpi.satisfaction}
          subtitle="Based on reviews"
          icon={Star}
        />
      </section>

      <section className="space-y-4 xl:hidden">
        <AppointmentsChart
          title="Appointments Overview"
          subtitle="May 2026"
          items={data.chart}
        />

        <RevenueCard
          periodLabel="May 2026 —"
          revenueLabel={data.kpi.revenueLabel}
          labels={data.revenue.labels}
          values={data.revenue.values}
          yTicks={data.revenue.yTicks}
        />

        <StatusSplitCard
          confirmed={data.kpi.treated}
          pending={data.kpi.pending}
          completed={data.kpi.completed}
        />

        <ThisWeekCard
          points={MOBILE_WEEK_POINTS}
          labels={MOBILE_WEEK_LABELS}
          title="This Week"
          subtitle="Daily patients"
        />

        <TopConditionsCard items={TOP_CONDITIONS} />

        <TodayScheduleCard
          dateLabel="May 12, 2026"
          appointments={TODAY_APPOINTMENTS}
        />
      </section>

      <section className="hidden xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-4">
        <div className="space-y-4">
          <AppointmentsChart
            title="Appointments Overview"
            subtitle="2026 YTD"
            items={data.chart}
          />

          <RevenueCard
            periodLabel={
              period === "day" ? "Today — May 12 —" : `${data.revenue.periodLabel} —`
            }
            revenueLabel={data.kpi.revenueLabel}
            labels={data.revenue.labels}
            values={data.revenue.values}
            yTicks={data.revenue.yTicks}
          />

        </div>

        <div className="space-y-4">
          <StatusSplitCard
            confirmed={data.kpi.treated}
            pending={data.kpi.pending}
            completed={data.kpi.completed}
          />
          <ThisWeekCard
            points={MOBILE_WEEK_POINTS}
            labels={MOBILE_WEEK_LABELS}
            title="This Week"
            subtitle="Daily patients"
          />
          <TopConditionsCard items={TOP_CONDITIONS} />
        </div>
      </section>

      <section className="hidden xl:block">
        <TodayScheduleCard
          dateLabel="May 12, 2026"
          appointments={TODAY_APPOINTMENTS}
        />
      </section>

      <MobileBottomNav />
    </main>
  );
}
