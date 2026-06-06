import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (_data: ChangePasswordForm) => {
    // TODO: integrate with API
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              Change Password
            </h3>
            <p className="text-xs text-slate-500">
              Enter your current password and choose a new one
            </p>
          </div>
          <button
            onClick={handleClose}
            className="grid size-8 cursor-pointer place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close change password dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
          <PasswordField
            label="Current Password"
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <PasswordField
            label="New Password"
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <PasswordField
            label="Confirm Password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 cursor-pointer rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 cursor-pointer rounded-2xl bg-indigo-700 text-sm font-semibold text-white transition enabled:hover:bg-indigo-800 disabled:opacity-40"
            >
              {isSubmitting ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
}

const PasswordField = ({
  label,
  show,
  onToggle,
  error,
  ref,
  ...rest
}: PasswordFieldProps) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        className={`h-11 w-full rounded-xl border bg-slate-50 px-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        {...rest}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
    {error ? (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    ) : null}
  </div>
);
