import FormModal from "@/components/form-modal";
import UseDentistQuery from "@/components/hook/use-dentist-query";
import useAppointmentUpdate from "@/components/hook/use-appointment-update";
import {
  appointmentSchema,
  type AppointmentSchema,
} from "@/components/lib/schema/appointment-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppointmentData } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type EditAppointmentForm = {
  dentistId: number;
  serviceId: number;
  hourId: number;
  appointmentDate: string;
  remarks: string;
};

type EditAppointmentErrors = Partial<Record<keyof AppointmentSchema, string>>;

type EditAppointmentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentData | null;
  onUpdated?: () => void;
};

export default function EditAppointment({
  open,
  onOpenChange,
  appointment,
  onUpdated,
}: EditAppointmentProps) {
  const { data: dentists = [], isLoading: isLoadingDentists } =
    UseDentistQuery();
  const updateAppointment = useAppointmentUpdate();
  const [dentistId, setDentistId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [hourId, setHourId] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<EditAppointmentErrors>({});

  const selectedDentist = useMemo(() => {
    return dentists.find((dentist) => dentist.id === dentistId) ?? null;
  }, [dentistId, dentists]);

  const selectedDay = useMemo(() => {
    if (!appointmentDate) return "";

    return new Date(`${appointmentDate}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }, [appointmentDate]);

  const availableSlots = useMemo(() => {
    return (
      selectedDentist?.operationHours?.filter(
        (slot) => slot.dayOfWeek === selectedDay,
      ) ?? []
    );
  }, [selectedDentist, selectedDay]);

  useEffect(() => {
    if (!appointment || !open) return;

    const fallbackDentist = dentists.find(
      (dentist) => dentist.name === appointment.dentistName,
    );
    const nextDentistId = appointment.dentistId ?? fallbackDentist?.id ?? null;
    const nextDentist =
      dentists.find((dentist) => dentist.id === nextDentistId) ??
      fallbackDentist ??
      null;
    const fallbackService = nextDentist?.services?.find(
      (service) => service.name === appointment.serviceName,
    );
    const nextServiceId = appointment.serviceId ?? fallbackService?.id ?? null;
    const appointmentDay = appointment.appointmentDate
      ? new Date(`${appointment.appointmentDate}T00:00:00`).toLocaleDateString(
          "en-US",
          { weekday: "long" },
        )
      : "";
    const fallbackHour = nextDentist?.operationHours?.find(
      (slot) =>
        slot.dayOfWeek === appointmentDay &&
        slot.startAt === appointment.startAt &&
        slot.endAt === appointment.endAt,
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDentistId(nextDentistId);
    setServiceId(nextServiceId);
    setHourId(appointment.hourId ?? fallbackHour?.id ?? null);
    setAppointmentDate(appointment.appointmentDate ?? "");
    setRemarks(appointment.remarks ?? "");
    setErrors({});
  }, [appointment, dentists, open]);

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = () => {
    if (!appointment) return;

    const values: EditAppointmentForm = {
      dentistId: dentistId ?? 0,
      serviceId: serviceId ?? 0,
      hourId: hourId ?? 0,
      appointmentDate,
      remarks,
    };

    const parsed = appointmentSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: EditAppointmentErrors = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AppointmentSchema | undefined;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      toast.error(parsed.error.issues[0]?.message || "Please check the form.");
      return;
    }

    updateAppointment.mutate(
      {
        id: appointment.id,
        ...parsed.data,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onUpdated?.();
        },
      },
    );
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Appointment"
      description="Choose the dentist, service, date, and available time slot."
      submitText="Update"
      onSubmit={handleSubmit}
      loading={updateAppointment.isPending || isLoadingDentists}
    >
      <form
        key={appointment?.id ?? "empty"}
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="dentist-id">Dentist</Label>
          <select
            id="dentist-id"
            value={dentistId ?? ""}
            onChange={(event) => {
              const nextDentistId = event.target.value
                ? Number(event.target.value)
                : null;

              setDentistId(nextDentistId);
              setServiceId(null);
              setHourId(null);
              setErrors((current) => ({
                ...current,
                dentistId: undefined,
                serviceId: undefined,
                hourId: undefined,
              }));
            }}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={isLoadingDentists}
          >
            <option value="">Select dentist</option>
            {dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.name}
              </option>
            ))}
          </select>
          {errors.dentistId && (
            <p className="text-sm text-red-500">{errors.dentistId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-id">Service</Label>
          <select
            id="service-id"
            value={serviceId ?? ""}
            onChange={(event) => {
              setServiceId(
                event.target.value ? Number(event.target.value) : null,
              );
              setErrors((current) => ({
                ...current,
                serviceId: undefined,
              }));
            }}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={!selectedDentist}
          >
            <option value="">Select service</option>
            {selectedDentist?.services?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (${service.price})
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="text-sm text-red-500">{errors.serviceId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-date">Appointment Date</Label>
          <Input
            id="appointment-date"
            type="date"
            value={appointmentDate}
            onChange={(event) => {
              setAppointmentDate(event.target.value);
              setHourId(null);
              setErrors((current) => ({
                ...current,
                appointmentDate: undefined,
                hourId: undefined,
              }));
            }}
          />
          {errors.appointmentDate && (
            <p className="text-sm text-red-500">{errors.appointmentDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hour-id">Time Slot</Label>
          <select
            id="hour-id"
            value={hourId ?? ""}
            onChange={(event) => {
              setHourId(event.target.value ? Number(event.target.value) : null);
              setErrors((current) => ({ ...current, hourId: undefined }));
            }}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={!selectedDentist || !appointmentDate}
          >
            <option value="">
              {appointmentDate ? "Select time slot" : "Select date first"}
            </option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
              </option>
            ))}
          </select>
          {appointmentDate && availableSlots.length === 0 && (
            <p className="text-sm text-gray-500">
              No available slots for this day.
            </p>
          )}
          {errors.hourId && (
            <p className="text-sm text-red-500">{errors.hourId}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            id="remarks"
            value={remarks}
            onChange={(event) => {
              setRemarks(event.target.value);
              setErrors((current) => ({ ...current, remarks: undefined }));
            }}
            placeholder="Remarks"
          />
          {errors.remarks && (
            <p className="text-sm text-red-500">{errors.remarks}</p>
          )}
        </div>
      </form>
    </FormModal>
  );
}
