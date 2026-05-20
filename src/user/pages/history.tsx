import { appointments } from "@/components/constants/data-dummy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointmentStatus } from "@/types/api";

const statusStyles: Record<AppointmentStatus, string> = {
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function History() {
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
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-gray-500">
                    {appointment.id}
                  </TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell className="font-medium">
                    {appointment.dentist}
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
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
