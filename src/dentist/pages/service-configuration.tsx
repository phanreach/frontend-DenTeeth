import {
 Building2,
 Camera,
 Check,
 Clock3,
 ImageIcon,
 MapPin,
 Pencil,
 Plus,
 Save,
 Send,
 Stethoscope,
 Trash2,
 User,
 ShieldCheck,
 Briefcase,
 type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import ServiceModal, { type ServiceSchema } from "../../components/dentist/service-modal";
import {
 SERVICE_CONFIGURATION_DATA,
 type ClinicIdentity,
} from "../constants/service-configuration-data";
import useCreateServices from "../hooks/use-create-services";
import useProfile from "../hooks/use-profile";
import useDentistServices from "../hooks/use-dentist-services";
import useUpdateService from "../hooks/use-update-service";
import useDeleteService from "../hooks/use-delete-service";
import useUploadProfilePhoto from "../hooks/use-upload-profile-photo";
import useUpdateProfile from "../hooks/use-update-profile";
import useCreateOperationHours from "../hooks/use-create-operation-hours";
import { deleteOperationHourApi, updateOperationHourApi } from "../../api/api";
import useOperationHours from "../hooks/use-operation-hours";



function formatOperationHoursSummary(days: Array<{ day: string; enabled: boolean; slots: Array<{startAt: string; endAt: string}> }>): string {
 const active = days.filter(d => d.enabled && d.slots.length > 0);
 if (active.length === 0) return "Closed";

 const firstHours = active[0].slots.map(s => `${s.startAt} - ${s.endAt}`).join(", ");
 const allSame = active.every(d => d.slots.map(s => `${s.startAt} - ${s.endAt}`).join(", ") === firstHours);

 if (allSame) {
 const dayNames = active.map(d => d.day).join(", ");
 return `${dayNames}: ${firstHours}`;
 }

 return active.map(d => `${d.day} (${d.slots.map(s => `${s.startAt}-${s.endAt}`).join(", ")})`).join(", ");
}

function FieldLabel({
 label,
 icon: Icon,
}: {
 label: string;
 icon?: LucideIcon;
}) {
 return (
 <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
 {Icon ? <Icon className="size-3.5" /> : null}
 <span>{label}</span>
 <span className="text-rose-500">*</span>
 </p>
 );
}

function ReadonlyField({
 label,
 value,
 icon,
}: {
 label: string;
 value: string | number;
 icon?: LucideIcon;
}) {
 return (
 <div className="space-y-1">
 <FieldLabel label={label} icon={icon} />
 <div className="h-11 rounded-xl bg-muted px-3.5 py-3 text-sm text-foreground/60 ring-1 ring-border truncate">
 {value}
 </div>
 </div>
 );
}

function EditableField({
 label,
 value,
 onChange,
 prefix,
 icon,
 onPaste,
 type = "text",
}: {
 label: string;
 value: string | number;
 onChange: (value: string) => void;
 prefix?: string;
 icon?: LucideIcon;
 onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
 type?: string;
}) {
 return (
 <label className="block space-y-1">
 <FieldLabel label={label} icon={icon} />
 <div className="relative">
 {prefix ? (
 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
 {prefix}
 </span>
 ) : null}
 <input
 type={type}
 value={value}
 onChange={(event) => onChange(event.target.value)}
 onPaste={onPaste}
 className={`h-11 w-full rounded-xl border border-indigo-600/20 bg-card px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 ${
 prefix ? "pl-8" : ""
 }`}
 />
 </div>
 </label>
 );
}

export default function ServiceConfiguration() {
 const queryClient = useQueryClient();
 const [activeTab, setActiveTab] = useState<"user-info" | "operation" | "service">("user-info");
 const [isEditingIdentity, setIsEditingIdentity] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
 const [identity, setIdentity] = useState<ClinicIdentity>(SERVICE_CONFIGURATION_DATA.identity);
 const [availableDays, setAvailableDays] = useState(SERVICE_CONFIGURATION_DATA.availableDays);
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const [servicesOffered, setServicesOffered] = useState<any[]>([]);
 const [profileImage, setProfileImage] = useState<string | null>(null);
 const [isSyncing, setIsSyncing] = useState(false);
 const fileInputRef = useRef<HTMLInputElement | null>(null);
 const [editingDays, setEditingDays] = useState<Record<string, boolean>>({});

 const { data: profile } = useProfile();
 const dentistId = profile?.id || profile?.userId;
 
 const { data: apiServices, isLoading: servicesLoading, refetch: refetchServices } = useDentistServices(dentistId);
 const createServicesMutation = useCreateServices();
 const updateServiceMutation = useUpdateService();
 const deleteServiceMutation = useDeleteService();
 const uploadPhotoMutation = useUploadProfilePhoto();
 const updateProfileMutation = useUpdateProfile();
 const createOperationHoursMutation = useCreateOperationHours();
 const { data: apiOperationHours } = useOperationHours(profile?.id);

 useEffect(() => {
 if (apiServices && !isEditingIdentity && !isSyncing) {
 // eslint-disable-next-line react-hooks/set-state-in-effect
      setServicesOffered(
 apiServices.map((s: unknown) => ({
 id: s.id, 
 name: s.name,
 description: s.description,
 price: s.price,
 duration: s.durationInMinutes,
 imageUrl: s.imageUrl,
 enabled: s.status === "ACTIVE",
 }))
 );
 }
 }, [apiServices, isEditingIdentity, isSyncing]);

 useEffect(() => {
 if (profile) {
 // eslint-disable-next-line react-hooks/set-state-in-effect
      setIdentity((prev) => ({
 ...prev,
 firstName: profile.firstName || prev.firstName,
 lastName: profile.lastName || prev.lastName,
 gender: profile.gender || prev.gender,
 phoneNumber: profile.phoneNumber || prev.phoneNumber,
 clinicName: profile.clinicName || prev.clinicName,
 biography: profile.biography || prev.biography,
 licenseNumber: profile.licenseNumber || prev.licenseNumber,
 yearsOfExperience: profile.yearsOfExperience ?? prev.yearsOfExperience,
 specialty: profile.profession || prev.specialty,
 address: profile.address || prev.address,
 }));

 const imageUrl = 
 profile.imageUrl || 
 profile.photoUrl || 
 profile.profilePictureUrl || 
 profile.image || 
 profile.profileImage ||
 profile.photo;

 if (imageUrl && typeof imageUrl === "string") {
 setProfileImage(imageUrl);
 }

 const hoursSource = (apiOperationHours && Array.isArray(apiOperationHours) && apiOperationHours.length > 0)
 ? apiOperationHours
 : (profile.operationHours && Array.isArray(profile.operationHours))
 ? profile.operationHours
 : [];

 if (hoursSource.length > 0) {
  const daysMap: Record<string, string> = {
 "1": "Mon", "MONDAY": "Mon", "MON": "Mon",
 "2": "Tue", "TUESDAY": "Tue", "TUE": "Tue",
 "3": "Wed", "WEDNESDAY": "Wed", "WED": "Wed",
 "4": "Thu", "THURSDAY": "Thu", "THU": "Thu",
 "5": "Fri", "FRIDAY": "Fri", "FRI": "Fri",
 "6": "Sat", "SATURDAY": "Sat", "SAT": "Sat",
 "7": "Sun", "SUNDAY": "Sun", "SUN": "Sun",
 };

 const updatedDays = SERVICE_CONFIGURATION_DATA.availableDays.map((item) => {
 const matchedSlots = hoursSource.filter(
 (slot: unknown  ) => daysMap[String(slot.dayOfWeek).toUpperCase()] === item.day
 );

 if (matchedSlots.length > 0) {
 const formatTime = (t: string) => t ? t.substring(0, 5) : "09:00";
 const validSlots = matchedSlots
   .filter((s: unknown) => s.status !== false)
   .map((s: unknown) => ({
     id: s.id,
      startAt: formatTime(s.startAt),
      endAt: formatTime(s.endAt),
    }));

 if (validSlots.length > 0) {
 return {
 ...item,
 enabled: true,
 slots: validSlots,
 };
 }
 }
 return {
 ...item,
 enabled: false,
 slots: [],
 };
 });

 setAvailableDays(updatedDays);

 const summary = formatOperationHoursSummary(updatedDays);
  
      setIdentity((prev) => ({
 ...prev,
 availableHours: summary,
 }));
 }
 }
 }, [profile, apiOperationHours]);



 const toggleService = async (index: number) => {
 const service = servicesOffered[index];
 const newEnabled = !service.enabled;

  
      setServicesOffered((prev) =>
 prev.map((s, i) => (i === index ? { ...s, enabled: newEnabled } : s))
 );

 if (service.id) {
 updateServiceMutation.mutate({
 id: service.id,
 data: { status: newEnabled ? 1 : 2 }
 });
 }
 };

 const handleSaveService = async (serviceData: ServiceSchema) => {
 setIsSyncing(true);
 try {
 if (editingServiceIndex !== null) {
 const service = servicesOffered[editingServiceIndex];
 if (service.id) {
 await updateServiceMutation.mutateAsync({
 id: service.id,
 data: {
 name: serviceData.name,
 description: serviceData.description,
 price: serviceData.price,
 durationInMinutes: serviceData.duration,
 imageUrl: serviceData.imageUrl,
 }
 });
 }
 } else {
 await createServicesMutation.mutateAsync([{
 name: serviceData.name,
 description: serviceData.description,
 price: serviceData.price,
 durationInMinutes: serviceData.duration,
 imageUrl: serviceData.imageUrl,
 orderIndex: servicesOffered.length + 1
 }]);
 }
 await refetchServices();
 } catch (err) {
 console.error("Operation failed:", err);
 } finally {
 setIsSyncing(false);
 setIsModalOpen(false);
 setEditingServiceIndex(null);
 }
 };

 const handleDeleteService = async (index: number) => {
 const service = servicesOffered[index];
 if (service.id) {
 setIsSyncing(true);
 try {
 await deleteServiceMutation.mutateAsync(service.id);
 await refetchServices();
 } finally {
 setIsSyncing(false);
 }
 } else {
  
      setServicesOffered((prev) => prev.filter((_, i) => i !== index));
 }
 };

 const openAddModal = () => {
 setEditingServiceIndex(null);
 setIsModalOpen(true);
 };

 const openEditModal = (index: number) => {
 setEditingServiceIndex(index);
 setIsModalOpen(true);
 };

 const handleProfileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
 const file = event.target.files?.[0];
 if (!file) return;

 try {
 const response = await uploadPhotoMutation.mutateAsync(file);
 const photoUrl = typeof response.data === "string" ? response.data : response.data?.publicUrl;
 
 if (response.success && photoUrl) {
 setProfileImage(photoUrl);
 toast.success("Profile photo updated!");
 }
 } catch (err) {
 console.error("Upload failed:", err);
 }
 };

 const handleSaveIdentity = async () => {
 if (isEditingIdentity) {
 try {
 // Save profile
 await updateProfileMutation.mutateAsync({
 userId: profile?.userId || profile?.id,
 firstName: identity.firstName || "",
 lastName: identity.lastName || "",
 gender: identity.gender || "MALE",
 phoneNumber: identity.phoneNumber || "",
 clinicName: identity.clinicName || "",
 biography: identity.biography || "",
 licenseNumber: identity.licenseNumber || "",
 yearsOfExperience: identity.yearsOfExperience || 0,
 });
 const summary = formatOperationHoursSummary(availableDays);
  
      setIdentity((prev) => ({ ...prev, availableHours: summary }));
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 } catch (err) {
 console.error("Profile update failed:", err);
 return;
 }
 }
 setIsEditingIdentity((prev) => !prev);
 };

 const handleSaveDay = async (day: string) => {
 setIsSyncing(true);
 try {
 const dayToNum: Record<string, number> = {
 "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7,
 };
  const daysMap: Record<string, string> = {
 "1": "Mon", "MONDAY": "Mon", "MON": "Mon",
 "2": "Tue", "TUESDAY": "Tue", "TUE": "Tue",
 "3": "Wed", "WEDNESDAY": "Wed", "WED": "Wed",
 "4": "Thu", "THURSDAY": "Thu", "THU": "Thu",
 "5": "Fri", "FRIDAY": "Fri", "FRI": "Fri",
 "6": "Sat", "SATURDAY": "Sat", "SAT": "Sat",
 "7": "Sun", "SUNDAY": "Sun", "SUN": "Sun",
 };
 const dayNum = dayToNum[day];
 const dayData = availableDays.find(d => d.day === day);
 if (!dayData) return;
 
 const hoursSource = (apiOperationHours && Array.isArray(apiOperationHours) && apiOperationHours.length > 0)
 ? apiOperationHours
 : (profile?.operationHours && Array.isArray(profile.operationHours))
 ? profile.operationHours
 : [];

 const originalSlotsForDay = hoursSource.filter((s: unknown) => 
 daysMap[String(s.dayOfWeek).toUpperCase()] === day
 ) || [];
 
 const originalSlotIds = originalSlotsForDay.map((s: unknown) => s.id).filter((id: unknown  ) => id);
 
 const currentSlots = dayData.enabled ? dayData.slots.filter(s => s.startAt && s.endAt) : [];
 const currentSlotIds = currentSlots.map(s => s.id).filter(id => id);
 
 const idsToDelete = originalSlotIds.filter((id: unknown  ) => !currentSlotIds.includes(id));
 if (idsToDelete.length > 0) {
 await Promise.all(idsToDelete.map((id: unknown  ) => deleteOperationHourApi(id)));
 }
 
 const slotsToUpdate: unknown  [] = [];
 const slotsToCreate: unknown  [] = [];
 
 for (const slot of currentSlots) {
 const payload = { dayOfWeek: dayNum, startAt: slot.startAt, endAt: slot.endAt };
 if (slot.id) {
 slotsToUpdate.push({ id: slot.id, data: payload });
 } else {
 slotsToCreate.push(payload);
 }
 }
 
 if (slotsToUpdate.length > 0) {
 await Promise.all(slotsToUpdate.map(update => updateOperationHourApi(update.id, update.data)));
 }
 
 if (slotsToCreate.length > 0) {
 const uniqueNewSlots = slotsToCreate.filter((slot, index, self) => 
 index === self.findIndex(s => s.startAt === slot.startAt && s.endAt === slot.endAt)
 );
 await createOperationHoursMutation.mutateAsync({ hours: uniqueNewSlots });
 }
 
 toast.success(`Operation hours for ${day} saved`);
 queryClient.invalidateQueries({ queryKey: ["operation-hours"] });
 queryClient.invalidateQueries({ queryKey: ["dentist-profile-full"] });
 setEditingDays(prev => ({ ...prev, [day]: false }));
 
 const summary = formatOperationHoursSummary(availableDays);
  
      setIdentity((prev) => ({ ...prev, availableHours: summary }));
 } catch (err) {
 console.error(`Failed to save ${day}`, err);
 toast.error(`Failed to save operation hours for ${day}`);
 } finally {
 setIsSyncing(false);
 }
 };

 const isBusy = createServicesMutation.isPending || updateServiceMutation.isPending || deleteServiceMutation.isPending || isSyncing || uploadPhotoMutation.isPending || updateProfileMutation.isPending || createOperationHoursMutation.isPending;

 return (
 <main className="space-y-8 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10">

 {/* Tabs Navigation */}
 <div className="flex border-b border-border">
 <button
 onClick={() => setActiveTab("user-info")}
 className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "user-info" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
 >
 User Info
 </button>
 <button
 onClick={() => setActiveTab("operation")}
 className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "operation" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
 >
 Operation
 </button>
 <button
 onClick={() => setActiveTab("service")}
 className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "service" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}
 >
 Service
 </button>
 </div>

 {/* Full Width Clinic Identity Card */}
 {activeTab === "user-info" && (
 <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
 <div className="flex flex-col gap-8 md:flex-row">
 <div className="flex flex-col items-center gap-4">
 <div className="group relative">
 {profileImage ? (
 <img
 src={profileImage}
 alt="Clinic profile"
 className="size-32 rounded-3xl border border-border object-cover shadow-inner"
 onError={() => console.error("[UI] Image failed to load:", profileImage)}
 />
 ) : (
 <div className="grid size-32 place-items-center rounded-3xl border border-border bg-muted text-slate-300">
 <ImageIcon className="size-12" />
 </div>
 )}
 {(isEditingIdentity || uploadPhotoMutation.isPending) && (
 <button
 disabled={uploadPhotoMutation.isPending}
 onClick={() => fileInputRef.current?.click()}
 className={`absolute inset-0 grid place-items-center rounded-3xl bg-black/40 text-white transition-opacity ${uploadPhotoMutation.isPending ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
 >
 {uploadPhotoMutation.isPending ? (
 <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
 ) : (
 <Camera className="size-6" />
 )}
 </button>
 )}
 </div>
 <div className="text-center">
 <input
 ref={fileInputRef}
 type="file"
 accept="image/png,image/jpeg"
 onChange={handleProfileUpload}
 className="hidden"
 />
 <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
 Clinic Logo
 </p>
 <p className="mt-1 text-[10px] text-muted-foreground/60">JPG, PNG up to 2MB</p>
 </div>
 </div>

 <div className="flex-1 space-y-6">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h2 className="text-base font-semibold text-foreground">Clinic Identity</h2>
 <p className="text-xs text-muted-foreground">Basic information about your practice.</p>
 </div>
 <button
 onClick={handleSaveIdentity}
 className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-100 px-4 text-[10px] font-semibold text-indigo-600 transition active:scale-95"
 >
 {isEditingIdentity ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
 {isEditingIdentity ? "Save" : "Edit"}
 </button>
 </div>

 <div className="grid gap-x-4 gap-y-6 md:grid-cols-3">
 {isEditingIdentity ? (
 <>
 <div className="md:col-span-3 space-y-4">
 <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 ">Personal Information</p>
 <div className="grid gap-4 md:grid-cols-3">
 <EditableField
 label="First Name"
 icon={User}
 value={identity.firstName || ""}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, firstName: value }))}
 />
 <EditableField
 label="Last Name"
 icon={User}
 value={identity.lastName || ""}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, lastName: value }))}
 />
 <div className="space-y-1">
 <FieldLabel label="Gender" icon={User} />
 <select
 value={identity.gender}
 onChange={(e) =>  
      setIdentity((prev) => ({ ...prev, gender: e.target.value }))}
 className="h-11 w-full rounded-xl border border-indigo-600/20 bg-card px-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
 >
 <option value="MALE">Male</option>
 <option value="FEMALE">Female</option>
 <option value="OTHER">Other</option>
 </select>
 </div>
 </div>
 </div>

 <div className="md:col-span-3 space-y-4 pt-2">
 <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 ">Clinic Information</p>
 <div className="grid gap-4 md:grid-cols-3">
 <div className="md:col-span-2">
 <EditableField
 label="Clinic Name"
 icon={Building2}
 value={identity.clinicName}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, clinicName: value }))}
 />
 </div>
 <EditableField
 label="Phone Number"
 icon={Send}
 value={identity.phoneNumber || ""}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, phoneNumber: value }))}
 />
 <EditableField
 label="Specialty"
 icon={Stethoscope}
 value={identity.specialty}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, specialty: value }))}
 />
 <EditableField
 label="License Number"
 icon={ShieldCheck}
 value={identity.licenseNumber || ""}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, licenseNumber: value }))}
 />
 <EditableField
 label="Years of Experience"
 icon={Briefcase}
 type="number"
 value={identity.yearsOfExperience || 0}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, yearsOfExperience: Number(value) }))}
 />

 <div className="md:col-span-2">
 <EditableField
 label="Clinic Address"
 icon={MapPin}
 value={identity.address}
 onChange={(value) =>  
      setIdentity((prev) => ({ ...prev, address: value }))}
 />
 </div>
 </div>
 </div>

 <div className="md:col-span-3 space-y-1">
 <FieldLabel label="Biography" icon={Pencil} />
 <textarea
 value={identity.biography || ""}
 onChange={(e) =>  
      setIdentity((prev) => ({ ...prev, biography: e.target.value }))}
 className="min-h-24 w-full rounded-xl border border-indigo-600/20 bg-card px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
 placeholder="Tell patients about your background and expertise..."
 />
 </div>
 </>
 ) : (
 <>
 <div className="md:col-span-3 space-y-4">
 <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Personal Information</p>
 <div className="grid gap-4 md:grid-cols-3">
 <ReadonlyField label="First Name" icon={User} value={identity.firstName || "Not provided"} />
 <ReadonlyField label="Last Name" icon={User} value={identity.lastName || "Not provided"} />
 <ReadonlyField label="Gender" icon={User} value={identity.gender || "Not provided"} />
 </div>
 </div>

 <div className="md:col-span-3 space-y-4 pt-2">
 <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Clinic Information</p>
 <div className="grid gap-4 md:grid-cols-3">
 <div className="md:col-span-2">
 <ReadonlyField label="Clinic Name" icon={Building2} value={identity.clinicName} />
 </div>
 <ReadonlyField label="Phone Number" icon={Send} value={identity.phoneNumber || "Not provided"} />
 <ReadonlyField label="Specialty" icon={Stethoscope} value={identity.specialty} />
 <ReadonlyField label="License" icon={ShieldCheck} value={identity.licenseNumber || "Not provided"} />
 <ReadonlyField label="Experience" icon={Briefcase} value={`${identity.yearsOfExperience || 0} Years`} />
 <ReadonlyField label="Available Hours" icon={Clock3} value={identity.availableHours} />
 <div className="md:col-span-2">
 <ReadonlyField label="Clinic Address" icon={MapPin} value={identity.address} />
 </div>
 </div>
 </div>

 <div className="md:col-span-3 space-y-1">
 <FieldLabel label="Biography" icon={Pencil} />
 <div className="min-h-20 rounded-xl bg-muted px-4 py-3 text-sm text-foreground/60 ring-1 ring-border leading-relaxed">
 {identity.biography || "No biography provided yet."}
 </div>
 </div>
 </>
 )}
 </div>

 </div>
 </div>
 </article>
 )}

 {/* Operation Section */}
 {activeTab === "operation" && (
 <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
 <div>
 <div className="flex items-center justify-between pb-4">
 <div>
 <h2 className="text-base font-semibold text-foreground">Operating Days & Hours</h2>
 <p className="text-xs text-muted-foreground">Manage your availability for appointments.</p>
 </div>
 
 </div>
 
 <div className="space-y-4">
 {availableDays.map((item) => {
 const isEnabled = item.enabled;
 return (
 <div
 key={item.day}
 className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl border transition ${
 isEnabled
 ? "bg-indigo-50 border-indigo-600/20"
 : "bg-muted/30 border-transparent opacity-60"
 }`}
 >
 {/* Left side: Checkbox + Day Name */}
 <div className="flex items-center gap-3 pt-2">
 <input
 type="checkbox"
 id={`day-${item.day}`}
 checked={isEnabled}
 disabled={!editingDays[item.day]}
 onChange={() => {
 if (editingDays[item.day]) {
 setAvailableDays((days) =>
 days.map((d) => (d.day === item.day ? { ...d, enabled: !d.enabled } : d))
 );
 }
 }}
 className="size-4 rounded border-indigo-600/20 text-indigo-600 focus:ring-indigo-600/20 disabled:opacity-50"
 />
 <label
 htmlFor={`day-${item.day}`}
 className="text-sm font-semibold text-foreground cursor-pointer select-none"
 >
 {item.day === "Mon" ? "Monday" :
 item.day === "Tue" ? "Tuesday" :
 item.day === "Wed" ? "Wednesday" :
 item.day === "Thu" ? "Thursday" :
 item.day === "Fri" ? "Friday" :
 item.day === "Sat" ? "Saturday" : "Sunday"}
 </label>
 </div>
  {/* Right side: Time Inputs */}
  <div className="flex flex-wrap gap-3 w-full sm:w-auto flex-1 sm:justify-end">
  {isEnabled ? (
  item.slots.map((slot, slotIndex) => (
  <div key={slotIndex} className={`flex items-center gap-2 ${editingDays[item.day] ? "p-3 rounded-xl border border-indigo-600/10 bg-background shadow-sm" : ""}`}>
  {editingDays[item.day] ? (
  <>
  <input
  type="time"
  value={slot.startAt}
  onChange={(e) => {
  setAvailableDays((days) =>
  days.map((d) => {
  if (d.day === item.day) {
  const newSlots = [...d.slots];
  newSlots[slotIndex].startAt = e.target.value;
  return { ...d, slots: newSlots };
  }
  return d;
  })
  );
  }}
  className="h-9 w-28 rounded-lg border border-indigo-600/20 bg-muted/30 px-2 text-xs font-semibold text-foreground outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
  />
  <span className="text-xs font-medium text-muted-foreground px-1">to</span>
  <input
  type="time"
  value={slot.endAt}
  onChange={(e) => {
  setAvailableDays((days) =>
  days.map((d) => {
  if (d.day === item.day) {
  const newSlots = [...d.slots];
  newSlots[slotIndex].endAt = e.target.value;
  return { ...d, slots: newSlots };
  }
  return d;
  })
  );
  }}
  className="h-9 w-28 rounded-lg border border-indigo-600/20 bg-muted/30 px-2 text-xs font-semibold text-foreground outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
  />
  {item.slots.length > 1 && (
  <button
  onClick={() => {
  setAvailableDays((days) =>
  days.map((d) => {
  if (d.day === item.day) {
  const newSlots = d.slots.filter((_, i) => i !== slotIndex);
   return { ...d, slots: newSlots };
  }
  return d;
  })
  );
  }}
  className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition ml-1"
  >
  <Trash2 className="size-3.5" />
  </button>
  )}
  </>
  ) : (
  <div className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-600/10 bg-background px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
  <Clock3 className="size-4" />
  <span>{slot.startAt} - {slot.endAt}</span>
  </div>
  )}
  </div>
  ))
  ) : (
  <span className="text-xs font-semibold text-muted-foreground pt-2">Closed</span>
  )}
  {isEnabled && editingDays[item.day] && (
  <button
  onClick={() => {
  setAvailableDays((days) =>
  days.map((d) => {
  if (d.day === item.day) {
  return { ...d, slots: [...d.slots, { startAt: "", endAt: "" }] };
  }
  return d;
  })
  );
  }}
  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-600/30 bg-transparent px-4 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
  >
  <Plus className="size-4" /> Add Slot
  </button>
  )}
  </div>
  <div className="flex items-center sm:ml-4 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
    <button
      onClick={() => editingDays[item.day] ? handleSaveDay(item.day) : setEditingDays(prev => ({...prev, [item.day]: true}))}
      disabled={isSyncing}
      className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-100 px-4 text-[10px] font-semibold text-indigo-600 transition active:scale-95 disabled:opacity-50"
    >
      {editingDays[item.day] ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
      {editingDays[item.day] ? "Save" : "Edit"}
    </button>
  </div>
 </div>
 );
 })}
 </div>
 </div>
 </article>
 )}

 {/* Services Section */}
 {activeTab === "service" && (
 <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-base font-semibold text-foreground">Services Offered</h2>
 <p className="text-xs text-muted-foreground">
 Manage the treatments and services provided by your clinic.
 </p>
 </div>
 <button
 onClick={openAddModal}
 disabled={isBusy}
 className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600/10 px-5 text-xs font-semibold text-indigo-600 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 "
 >
 {isBusy ? (
 <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
 ) : (
 <Plus className="size-4" />
 )}
 {isBusy ? "Syncing..." : "Add New Service"}
 </button>
 </div>

 {servicesLoading ? (
 <div className="flex h-32 items-center justify-center">
 <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
 </div>
 ) : (
 <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {servicesOffered.map((service, index) => (
 <div
 key={service.id || `local-${index}`}
 className={`group flex flex-col rounded-2xl border p-4 transition ${
 service.enabled
 ? "border-indigo-600/20 bg-indigo-50 shadow-sm shadow-indigo-50 "
 : "border-border bg-muted/50"
 }`}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0 flex-1 space-y-1">
 <p
 className={`truncate text-sm font-semibold ${
 service.enabled ? "text-indigo-600 " : "text-foreground"
 }`}
 >
 {service.name}
 </p>
 {service.description && (
 <p className="line-clamp-2 leading-relaxed text-[11px] font-medium text-muted-foreground">
 {service.description}
 </p>
 )}
 </div>
 <div className="flex items-center gap-1.5 text-muted-foreground">
 <>
 <button
 onClick={() => openEditModal(index)}
 className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-indigo-600/10 hover:text-indigo-600 "
 >
 <Pencil className="size-3.5" />
 </button>
 <button
 onClick={() => handleDeleteService(index)}
 className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
 >
 <Trash2 className="size-3.5" />
 </button>
 </>
 <button
 onClick={() => toggleService(index)}
 className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-xl transition ${
 service.enabled
 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 "
 : "bg-muted text-muted-foreground"
 }`}
 >
 {service.enabled ? (
 <Check className="size-4 stroke-[3px]" />
 ) : (
 <Plus className="size-4" />
 )}
 </button>
 </div>
 </div>

 <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
 {service.price !== undefined && (
 <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
 <span className="text-[10px] text-muted-foreground">$</span>
 <span>{service.price}</span>
 </div>
 )}
 {service.duration !== undefined && (
 <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
 <Clock3 className="size-3.5" />
 <span>{service.duration} min</span>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </article>
 )}

 <ServiceModal
 isOpen={isModalOpen}
 onClose={() => {
 setIsModalOpen(false);
 setEditingServiceIndex(null);
 }}
 onSave={handleSaveService}
 initialData={
 editingServiceIndex !== null
 ? {
 name: servicesOffered[editingServiceIndex].name,
 description: servicesOffered[editingServiceIndex].description || "",
 price: servicesOffered[editingServiceIndex].price || 0,
 duration: servicesOffered[editingServiceIndex].duration || 0,
 imageUrl: servicesOffered[editingServiceIndex].imageUrl || "",
 }
 : null
 }
 />

 <MobileBottomNav active="services" />
 </main>
 );
}
