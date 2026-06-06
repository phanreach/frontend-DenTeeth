import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.coerce.number().int().positive("Duration must be a positive integer"),
});

export type ServiceSchema = {
  name: string;
  description: string;
  price: number;
  duration: number;
};

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceSchema) => void;
  initialData?: ServiceSchema | null;
}

export default function ServiceModal({ isOpen, onClose, onSave, initialData }: ServiceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        duration: 30,
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: ServiceSchema) => {
    onSave(data);
    reset();
    onClose();
  };

  const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "-", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="text-base font-semibold text-neutral-900">
            {initialData ? "Edit Service" : "Add New Service"}
          </h3>
          <button
            onClick={onClose}
            className="grid size-8 cursor-pointer place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Service Name <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Scaling & Polishing"
              className="h-11 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the service..."
              className="min-h-24 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
            />
            {errors.description && (
              <p className="text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                onKeyDown={blockInvalidChar}
                {...register("price")}
                className="h-11 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
              />
              {errors.price && <p className="text-xs text-rose-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Duration (min) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                onKeyDown={blockInvalidChar}
                {...register("duration")}
                className="h-11 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
              />
              {errors.duration && <p className="text-xs text-rose-500">{errors.duration.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-800"
            >
              {initialData ? "Save Changes" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
