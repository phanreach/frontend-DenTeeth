import useAppointmentQuery from "@/components/hook/use-appointment-query";
import { SkeletonTable } from "@/components/ui/skeletontable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointmentData } from "@/types/api";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock4,
  CalendarOff,
  Pencil,
  Trash,
} from "lucide-react";
import EditAppointment from "../components/edit-appointment";
import type { ReactNode } from "react";
import { useState } from "react";
import useAppointmentDelete from "@/components/hook/use-appointment-delete";
import { DeleteDialog } from "@/components/delete-dialog";
const formatTime = (time: string) => {
  if (!time) return "-";
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusConfig: Record<
  AppointmentData["status"],
  { label: string; icon: ReactNode; className: string }
> = {
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="w-3 h-3" />,
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  PENDING: {
    label: "Pending",
    icon: <Clock4 className="w-3 h-3" />,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
};

function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: {
  appointment: AppointmentData;
  onEdit: (appointment: AppointmentData) => void;
  onDelete: (appointment: AppointmentData) => void;
}) {
  const status = statusConfig[appointment.status];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400">
          #{appointment.id}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-2.5 justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {appointment.dentistName}
          </p>
          <p className="text-xs text-gray-500">{appointment.serviceName}</p>
        </div>
        <div>
          <button
            className="rounded p-1 transition hover:bg-gray-100"
            onClick={() => onEdit(appointment)}
          >
            <Pencil className="h-4 w-4 text-primary" />
          </button>

          <button
            className="rounded p-1 transition hover:bg-red-50"
            onClick={() => onDelete(appointment)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
          {appointment.appointmentDate}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock4 className="h-3.5 w-3.5 text-gray-400" />
          {formatTime(appointment.startAt)}
          <span className="text-gray-300">–</span>
          {formatTime(appointment.endAt)}
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const { data: appointments = [], isLoading, isError } = useAppointmentQuery();

  const isEmpty = !isLoading && !isError && appointments.length === 0;
  const hasData = !isLoading && !isError && appointments.length > 0;
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteAppointment, setSelectedDeleteAppointment] =
    useState<AppointmentData | null>(null);

  const { mutate: deleteAppointment, isPending: isDeleting } =
    useAppointmentDelete();

  const handleEdit = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setOpenEdit(true);
  };
  const handleDelete = (appointment: AppointmentData) => {
    setSelectedDeleteAppointment(appointment);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (!selectedDeleteAppointment) return;

    deleteAppointment(selectedDeleteAppointment.id, {
      onSuccess: () => {
        setOpenDelete(false);
        setSelectedDeleteAppointment(null);
      },
    });
  };
  return (
    <div>
      <EditAppointment
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) {
            setSelectedAppointment(null);
          }
        }}
        appointment={selectedAppointment}
        onUpdated={() => setSelectedAppointment(null)}
      />
      <DeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);

          if (!open) {
            setSelectedDeleteAppointment(null);
          }
        }}
        title="Delete Appointment"
        description={`Are you sure you want to delete appointment #${selectedDeleteAppointment?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />

      <div className="border-b bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-jci-primary-dark/10 sm:h-10 sm:w-10">
              <CalendarDays className="h-4 w-4 text-jci-primary-dark sm:h-5 sm:w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-jci-primary-dark sm:text-2xl">
                Appointment History
              </h1>
              <p className="text-xs text-gray-400 sm:text-sm">
                View all your past and upcoming appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {isLoading && <SkeletonTable />}

        {isError && (
          <div className="flex flex-col items-center gap-1.5 py-16">
            <XCircle className="h-7 w-7 text-red-400" />
            <p className="text-sm font-medium text-red-500">
              Failed to load appointments
            </p>
            <p className="text-xs text-gray-400">Please try again later</p>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center gap-1.5 py-16 text-gray-400">
            <CalendarOff className="h-7 w-7" />
            <p className="text-sm font-medium">No appointments found</p>
            <p className="text-xs">Your appointment history will appear here</p>
          </div>
        )}

        {hasData && (
          <>
            <div className="space-y-3 md:hidden">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <p className="pt-1 text-center text-xs text-gray-400">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""} total
              </p>
            </div>

            <div className="hidden md:block">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        {[
                          "ID",
                          "Date",
                          "Time",
                          "Dentist",
                          "Service",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-400"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {appointments.map((appointment) => {
                        const status = statusConfig[appointment.status];

                        return (
                          <TableRow
                            key={appointment.id}
                            className="transition-colors hover:bg-slate-50/70"
                          >
                            <TableCell className="w-[80px] font-mono text-xs text-gray-400">
                              #{appointment.id}
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-sm text-gray-700">
                              {appointment.appointmentDate}
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-sm text-gray-500">
                              {formatTime(appointment.startAt)}
                              <span className="mx-1 text-gray-300">–</span>
                              {formatTime(appointment.endAt)}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <span className="whitespace-nowrap text-sm font-medium text-gray-800">
                                  {appointment.dentistName}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-sm text-gray-600">
                              {appointment.serviceName}
                            </TableCell>

                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <button
                                  className="rounded p-1 transition hover:bg-gray-100"
                                  onClick={() => handleEdit(appointment)}
                                >
                                  <Pencil className="h-4 w-4 text-primary" />
                                </button>
                                <button
                                  className="rounded p-1 transition hover:bg-red-50"
                                  onClick={() => handleDelete(appointment)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                  <p className="text-xs text-gray-400">
                    {appointments.length} appointment
                    {appointments.length !== 1 ? "s" : ""} total
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
