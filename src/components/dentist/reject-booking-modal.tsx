import { Circle, CircleDot, X } from "lucide-react";
import { useState } from "react";
import { REJECT_REASONS } from "../../dentist/constants/appointment-actions-data";

interface RejectBookingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectBookingModal({ open, onClose, onConfirm }: RejectBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="text-base font-semibold text-neutral-900">Reject Booking?</h3>
          <button
            onClick={onClose}
            className="grid size-8 cursor-pointer place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close reject booking dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm text-slate-500">Please select a reason for rejecting this appointment.</p>

          <div className="space-y-2">
            {REJECT_REASONS.map((reason) => {
              const selected = reason === selectedReason;

              return (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`flex h-11 w-full cursor-pointer items-center gap-2 rounded-2xl px-4 text-sm transition ${
                    selected
                      ? "border border-red-200 bg-red-50 text-red-600"
                      : "bg-slate-100 text-neutral-900 hover:bg-slate-200"
                  }`}
                >
                  {selected ? <CircleDot className="size-4" /> : <Circle className="size-4 text-slate-400" />}
                  {reason}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="h-11 cursor-pointer rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500 transition hover:bg-slate-200"
            >
              Keep
            </button>
            <button
              onClick={() => onConfirm(selectedReason)}
              className="h-11 cursor-pointer rounded-2xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
