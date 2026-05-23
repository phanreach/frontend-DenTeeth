import { useEffect, useMemo, useState } from "react";
import type { dentist } from "@/types/api";
import { MoveRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import useAppointmentMutation from "@/components/hook/use-appointment-mutation";
import {
  appointmentSchema,
  type AppointmentSchema,
} from "@/components/lib/schema/appointment-schema";

interface AppointmentFormProps {
  data: dentist;
  selectedService: number | null;
}

type AppointmentFormErrors = Partial<Record<keyof AppointmentSchema, string>>;

export default function AppointmentForm({
  data,
  selectedService,
}: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const appointmentMutation = useAppointmentMutation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrors((current) => ({ ...current, serviceId: undefined }));
  }, [selectedService]);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return "";

    return new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }, [selectedDate]);

  const availableSlots = useMemo(() => {
    return (
      data.operationHours?.filter((slot) => slot.dayOfWeek === selectedDay) ||
      []
    );
  }, [data.operationHours, selectedDay]);

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedServiceData = data.services?.find(
    (service) => service.id === selectedService,
  );

  const handleBooking = () => {
    const parsed = appointmentSchema.safeParse({
      dentistId: data.id,
      serviceId: selectedService ?? 0,
      hourId: selectedSlot ?? 0,
      appointmentDate: selectedDate,
      remarks,
    });

    if (!parsed.success) {
      const nextErrors: AppointmentFormErrors = {};

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

    appointmentMutation.mutate(parsed.data, {
      onSuccess: () => {
        setSelectedDate("");
        setSelectedSlot(null);
        setRemarks("");
        setErrors({});
      },
    });
  };

  return (
    <div className="sticky top-6 h-fit rounded-2xl bg-white shadow-sm">
      <div className="rounded-t-2xl bg-primary p-5 text-white">
        <p className="text-lg font-semibold">Book an Appointment</p>

        <p className="mt-1 text-sm text-blue-100">
          Select your preferred date and time slot.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-500">
            SELECTED SERVICE <span className="text-red-500">*</span>
          </label>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            {selectedServiceData ? (
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedServiceData.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  ${selectedServiceData.price}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Please select a service</p>
            )}
          </div>
          {errors.serviceId && (
            <p className="mt-2 text-sm text-red-500">{errors.serviceId}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-500">
            APPOINTMENT DATE <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
              setErrors((current) => ({
                ...current,
                appointmentDate: undefined,
                hourId: undefined,
              }));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary"
          />
          {errors.appointmentDate && (
            <p className="mt-2 text-sm text-red-500">
              {errors.appointmentDate}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-500">
            AVAILABLE TIME SLOTS <span className="text-red-500">*</span>
          </label>

          <select
            value={selectedSlot ?? ""}
            onChange={(e) => {
              setSelectedSlot(e.target.value ? Number(e.target.value) : null);
              setErrors((current) => ({ ...current, hourId: undefined }));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary"
          >
            <option value="">Select time slot</option>

            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
              </option>
            ))}
          </select>
          {errors.hourId && (
            <p className="mt-2 text-sm text-red-500">{errors.hourId}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            REMARKS
          </label>

          <textarea
            rows={5}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              setErrors((current) => ({ ...current, remarks: undefined }));
            }}
            placeholder="Describe any specific dental concerns..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
          />
          {errors.remarks && (
            <p className="mt-2 text-sm text-red-500">{errors.remarks}</p>
          )}
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-secondary p-4 text-sm text-primary">
          <ShieldCheck className="shrink-0" />

          <p>
            DenTeeth Secure Booking. Your medical data is encrypted with
            HIPAA-compliant clinical intelligence.
          </p>
        </div>

        <button
          onClick={handleBooking}
          disabled={appointmentMutation.isPending}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {appointmentMutation.isPending ? "Booking..." : "Confirm Appointment"}
          <MoveRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
