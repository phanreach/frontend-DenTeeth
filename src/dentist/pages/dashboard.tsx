import { useMemo, useState } from "react";
import { AlertCircle, Calendar, Star, Users } from "lucide-react";
import AppointmentsChart from "../../components/dentist/appointments-chart";
import StatusSplitCard from "../../components/dentist/status-split-card";
import ThisWeekCard from "../../components/dentist/this-week-card";
import TopConditionsCard from "../../components/dentist/top-conditions-card";
import RevenueCard from "../../components/dentist/revenue-card";
import TodayScheduleCard from "../../components/dentist/today-schedule-card";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import KpiCard from "../../components/dentist/kpi-card";
import PeriodTabs from "../../components/dentist/period-tabs";
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
  const data = useMemo(() => PERIOD_DATA[period], [period]);

  const chartSubtitle = useMemo(() => {
    switch (period) {
      case "day":
        return "May 12, 2026";
      case "week":
        return "May 11 — May 17, 2026";
      case "month":
        return "May 2026";
      case "year":
        return "2026 YTD";
      default:
        return "";
    }
  }, [period]);

  return (
    <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PeriodTabs value={period} onChange={setPeriod} />
        <p className="text-sm font-medium text-muted-foreground">
          Last updated: <span className="font-bold text-foreground">Just now</span>
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Appointments"
          value={data.kpi.appointments.toLocaleString()}
          subtitle="↗ +9% vs last period"
          icon={Calendar}
          featured
        />
        <KpiCard
          title="Treated Patients"
          value={data.kpi.treated.toLocaleString()}
          subtitle="3 confirmed today"
          icon={Users}
        />
        <KpiCard
          title="Pending Actions"
          value={data.kpi.pending.toLocaleString()}
          subtitle="Requires attention"
          icon={AlertCircle}
        />
        <KpiCard
          title="Avg. Satisfaction"
          value={data.kpi.satisfaction}
          subtitle="↗ Based on latest reviews"
          icon={Star}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          <AppointmentsChart
            title="Appointments Overview"
            subtitle={chartSubtitle}
            items={data.chart}
          />

          <RevenueCard
            periodLabel={data.revenue.periodLabel}
            revenueLabel={data.kpi.revenueLabel}
            labels={data.revenue.labels}
            values={data.revenue.values}
            yTicks={data.revenue.yTicks}
          />

          <TodayScheduleCard
            dateLabel="May 12, 2026"
            appointments={TODAY_APPOINTMENTS}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <StatusSplitCard
            confirmed={data.kpi.treated}
            pending={data.kpi.pending}
            completed={data.kpi.completed}
          />
          <ThisWeekCard
            points={MOBILE_WEEK_POINTS}
            labels={MOBILE_WEEK_LABELS}
            title="Weekly Activity"
            subtitle="Patient volume trend"
          />
          <TopConditionsCard items={TOP_CONDITIONS} />
        </div>
      </div>

      <MobileBottomNav active="dashboard" />
    </main>
  );
}
