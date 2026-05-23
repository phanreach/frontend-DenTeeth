import { useMemo, useState } from "react";
import type { dentist } from "@/types/api";
import { MoveRight, ShieldCheck } from "lucide-react";

interface AppointmentFormProps {
  data: dentist;
  selectedService: number | null;
}

export default function AppointmentForm({
  data,
  selectedService,
}: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");

  const selectedDay = useMemo(() => {
    if (!selectedDate) return "";

    return new Date(selectedDate).toLocaleDateString("en-US", {
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
    console.log({
      dentistId: data.id,
      serviceId: selectedService,
      operationHourId: selectedSlot,
      appointmentDate: selectedDate,
      remarks,
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
            SELECTED SERVICE
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
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-500">
            APPOINTMENT DATE
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-500">
            AVAILABLE TIME SLOTS
          </label>

          <select
            value={selectedSlot ?? ""}
            onChange={(e) => setSelectedSlot(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary"
          >
            <option value="">Select time slot</option>

            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            REMARKS
          </label>

          <textarea
            rows={5}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Describe any specific dental concerns..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
          />
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
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Confirm Appointment
          <MoveRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
