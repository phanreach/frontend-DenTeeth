import { X, UploadCloud, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

const serviceSchema = z.object({
 name: z.string().min(1, "Name is required"),
 description: z.string().min(1, "Description is required"),
 price: z.coerce.number().min(0, "Price must be a positive number"),
 duration: z.coerce.number().int().positive("Duration must be a positive integer"),
 imageUrl: z.string().optional(),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

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
 setValue,
 watch,
 formState: { errors },
 } = useForm<ServiceSchema>({
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 resolver: zodResolver(serviceSchema) as any,
 defaultValues: {
 name: "",
 description: "",
 price: 0,
 duration: 30,
 imageUrl: "",
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
 imageUrl: "",
 });
 }
 }, [initialData, reset]);

 // eslint-disable-next-line react-hooks/incompatible-library
  const imageUrl = watch("imageUrl");
 const [isUploading, setIsUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 if (!isOpen) return null;

 const handleFormSubmit = (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 onSave(data as any);
 reset();
 onClose();
 };

 const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
 if (["e", "E", "-", "+"].includes(e.key)) {
 e.preventDefault();
 }
 };

  const handleFileUpload = async (file: File) => {
  setIsUploading(true);
  try {
  const reader = new FileReader();
  reader.onloadend = () => {
  const base64String = reader.result as string;
  setValue("imageUrl", base64String);
  setIsUploading(false);
  };
  reader.onerror = () => {
  toast.error("Failed to process image");
  setIsUploading(false);
  };
  reader.readAsDataURL(file);
  } catch (err: unknown  ) {
  console.error("Processing failed", err);
  toast.error((err as Error).message || "Failed to process photo");
  setIsUploading(false);
  }
  };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 const file = e.dataTransfer.files?.[0];
 if (file && file.type.startsWith("image/")) handleFileUpload(file);
 };

 const handlePaste = (e: React.ClipboardEvent) => {
 const file = e.clipboardData.files?.[0];
 if (file && file.type.startsWith("image/")) handleFileUpload(file);
 };

 return (
 <div
 className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
 onClick={onClose}
 >
 <div
 className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
 onClick={(event) => event.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-border px-5 py-4">
 <h3 className="text-base font-semibold text-foreground">
 {initialData ? "Edit Service" : "Add New Service"}
 </h3>
 <button
 onClick={onClose}
 className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80"
 >
 <X className="size-4" />
 </button>
 </div>

 <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-5">
 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Service Name <span className="text-rose-500">*</span>
 </label>
 <input
 {...register("name")}
 placeholder="e.g. Scaling & Polishing"
 className="h-11 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 "
 />
 {errors.name && <p className="text-[10px] font-semibold text-rose-500">{errors.name.message}</p>}
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Description <span className="text-rose-500">*</span>
 </label>
 <textarea
 {...register("description")}
 placeholder="Describe the service..."
 className="min-h-24 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 "
 />
 {errors.description && (
 <p className="text-[10px] font-semibold text-rose-500">{errors.description.message}</p>
 )}
 </div>

 <div className="space-y-1.5">
  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
  Service Image
  </label>
  <div
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
  onPaste={handlePaste}
  onClick={() => fileInputRef.current?.click()}
  className="group relative flex h-24 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition hover:border-indigo-600 hover:bg-indigo-50/50 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
  tabIndex={0}
  >
  <input
  ref={fileInputRef}
  type="file"
  accept="image/png, image/jpeg, image/jpg"
  className="hidden"
  onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) handleFileUpload(file);
  }}
  />
  {isUploading ? (
  <div className="flex flex-col items-center gap-2">
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
  <span className="text-[10px] font-semibold text-indigo-600">Uploading...</span>
  </div>
  ) : imageUrl ? (
  <>
  <img src={imageUrl} alt="Service preview" className="h-full w-full object-cover" />
  <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100">
  <Camera className="size-6 text-white" />
  </div>
  </>
  ) : (
  <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-indigo-600">
  <UploadCloud className="size-6" />
  <span className="text-xs font-medium">Click, drag, or paste image</span>
  </div>
  )}
  </div>
  {errors.imageUrl && (
  <p className="text-[10px] font-semibold text-rose-500">{errors.imageUrl.message}</p>
  )}
  </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Price ($) <span className="text-rose-500">*</span>
 </label>
 <input
 type="number"
 step="0.01"
 min="0"
 onKeyDown={blockInvalidChar}
 {...register("price")}
 className="h-11 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 "
 />
 {errors.price && <p className="text-[10px] font-semibold text-rose-500">{errors.price.message}</p>}
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Duration (min) <span className="text-rose-500">*</span>
 </label>
 <input
 type="number"
 min="0"
 onKeyDown={blockInvalidChar}
 {...register("duration")}
 className="h-11 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 "
 />
 {errors.duration && <p className="text-[10px] font-semibold text-rose-500">{errors.duration.message}</p>}
 </div>
 </div>

 <div className="pt-2">
 <button
 type="submit"
 className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-95 "
 >
 {initialData ? "Save Changes" : "Add Service"}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
