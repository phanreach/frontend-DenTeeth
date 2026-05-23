import useAppointmentQuery from "@/components/hook/use-appointment-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointmentData } from "@/types/api";

const statusStyles: Record<AppointmentData["status"], string> = {
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

const formatTime = (time: string) => {
  if (!time) return "-";

  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: AppointmentData["status"]) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export default function History() {
  const { data: appointments = [], isLoading, isError } = useAppointmentQuery();

  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-jci-primary-dark">
              My Appointments History
            </h1>
            <p className="text-sm text-gray-500">
              Check your history appointments
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Dentist</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    Loading appointments...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-red-500">
                    Failed to load appointments.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-gray-500">
                    {appointment.id}
                  </TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>
                    {formatTime(appointment.startAt)} -{" "}
                    {formatTime(appointment.endAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.dentistName}
                  </TableCell>
                  <TableCell>{appointment.serviceName}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[appointment.status]}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
