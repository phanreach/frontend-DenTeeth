import {
  Building2,
  Camera,
  Check,
  Clock3,
  Compass,
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
      <div className="h-11 rounded-2xl bg-muted px-3.5 py-3 text-sm text-foreground/60 ring-1 ring-border truncate">
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
          className={`h-11 w-full rounded-2xl border border-indigo-700/20 bg-card px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20 ${
            prefix ? "pl-8" : ""
          }`}
        />
      </div>
    </label>
  );
}

export default function ServiceConfiguration() {
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [identity, setIdentity] = useState<ClinicIdentity>(SERVICE_CONFIGURATION_DATA.identity);
  const [availableDays, setAvailableDays] = useState(SERVICE_CONFIGURATION_DATA.availableDays);
  const [servicesOffered, setServicesOffered] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile } = useProfile();
  const dentistId = profile?.id || profile?.userId;
  
  const { data: apiServices, isLoading: servicesLoading, refetch: refetchServices } = useDentistServices(dentistId);
  const createServicesMutation = useCreateServices();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  const uploadPhotoMutation = useUploadProfilePhoto();

  useEffect(() => {
    if (apiServices && !isEditingIdentity && !isSyncing) {
      setServicesOffered(
        apiServices.map((s: any) => ({
          id: s.id, 
          name: s.name,
          description: s.description,
          price: s.price,
          duration: s.durationInMinutes,
          enabled: s.status === "ACTIVE",
        }))
      );
    }
  }, [apiServices, isEditingIdentity, isSyncing]);

  useEffect(() => {
    if (profile) {
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
    }
  }, [profile]);

  const toggleDay = (day: string) => {
    if (!isEditingIdentity) {
      toast.info("Click Edit on Clinic Identity to change available days.");
      return;
    }
    setAvailableDays((days) =>
      days.map((item) => (item.day === day ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const toggleService = async (index: number) => {
    const service = servicesOffered[index];
    const newEnabled = !service.enabled;

    setServicesOffered((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: newEnabled } : s))
    );

    if (service.id) {
      updateServiceMutation.mutate({
        id: service.id,
        data: { status: newEnabled ? 1 : 0 }
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
            }
          });
        }
      } else {
        await createServicesMutation.mutateAsync([{
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          durationInMinutes: serviceData.duration,
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

  const handleSaveIdentity = () => {
    if (isEditingIdentity) {
      toast.success("Clinic identity updated.");
    }
    setIsEditingIdentity((prev) => !prev);
  };

  const sanitizeCoordinate = (value: string) => {
    return value
      .replace(/[^0-9.-]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/(?!^)-/g, "");
  };

  const handleCoordinatePaste = () => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    const coords = pasteData.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);

    if (coords.length >= 2) {
      e.preventDefault();
      const lat = sanitizeCoordinate(coords[0]);
      const lng = sanitizeCoordinate(coords[1]);

      setIdentity((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      toast.info(`Extracted coordinates: Lat ${lat}, Lng ${lng}`);
    }
  };

  const isBusy = createServicesMutation.isPending || updateServiceMutation.isPending || deleteServiceMutation.isPending || isSyncing || uploadPhotoMutation.isPending;

  return (
    <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          View and manage your clinical profile and services.
        </p>
      </section>

      {/* Full Width Clinic Identity Card */}
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Clinic Logo
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/60">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Clinic Identity</h2>
                <p className="text-xs text-muted-foreground">Basic information about your practice.</p>
              </div>
              <button
                onClick={handleSaveIdentity}
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-100 px-4 text-[10px] font-bold text-indigo-700 transition active:scale-95"
              >
                {isEditingIdentity ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
                {isEditingIdentity ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid gap-x-4 gap-y-6 md:grid-cols-3">
              {isEditingIdentity ? (
                <>
                  <div className="md:col-span-3 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Personal Information</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <EditableField
                        label="First Name"
                        icon={User}
                        value={identity.firstName || ""}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, firstName: value }))}
                      />
                      <EditableField
                        label="Last Name"
                        icon={User}
                        value={identity.lastName || ""}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, lastName: value }))}
                      />
                      <div className="space-y-1">
                        <FieldLabel label="Gender" icon={User} />
                        <select
                          value={identity.gender}
                          onChange={(e) => setIdentity((prev) => ({ ...prev, gender: e.target.value }))}
                          className="h-11 w-full rounded-2xl border border-indigo-700/20 bg-card px-3 text-sm text-foreground outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-4 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Clinic Information</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <EditableField
                          label="Clinic Name"
                          icon={Building2}
                          value={identity.clinicName}
                          onChange={(value) => setIdentity((prev) => ({ ...prev, clinicName: value }))}
                        />
                      </div>
                      <EditableField
                        label="Phone Number"
                        icon={Send}
                        value={identity.phoneNumber || ""}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, phoneNumber: value }))}
                      />
                      <EditableField
                        label="Specialty"
                        icon={Stethoscope}
                        value={identity.specialty}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, specialty: value }))}
                      />
                      <EditableField
                        label="License Number"
                        icon={ShieldCheck}
                        value={identity.licenseNumber || ""}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, licenseNumber: value }))}
                      />
                      <EditableField
                        label="Years of Experience"
                        icon={Briefcase}
                        type="number"
                        value={identity.yearsOfExperience || 0}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, yearsOfExperience: Number(value) }))}
                      />
                       <EditableField
                        label="Available Hours"
                        icon={Clock3}
                        value={identity.availableHours}
                        onChange={(value) =>
                          setIdentity((prev) => ({ ...prev, availableHours: value }))
                        }
                      />
                      <div className="md:col-span-2">
                        <EditableField
                          label="Clinic Address"
                          icon={MapPin}
                          value={identity.address}
                          onChange={(value) => setIdentity((prev) => ({ ...prev, address: value }))}
                        />
                      </div>
                      <EditableField
                        label="Latitude"
                        icon={Compass}
                        value={identity.latitude}
                        onPaste={handleCoordinatePaste()}
                        onChange={(value) =>
                          setIdentity((prev) => ({ ...prev, latitude: sanitizeCoordinate(value) }))
                        }
                      />
                      <EditableField
                        label="Longitude"
                        icon={Compass}
                        value={identity.longitude}
                        onPaste={handleCoordinatePaste()}
                        onChange={(value) =>
                          setIdentity((prev) => ({ ...prev, longitude: sanitizeCoordinate(value) }))
                        }
                      />
                      <EditableField
                        label="Telegram Username"
                        icon={Send}
                        value={identity.telegramUsername}
                        prefix="@"
                        onChange={(value) =>
                          setIdentity((prev) => ({
                            ...prev,
                            telegramUsername: value.replace(/^@/, ""),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <FieldLabel label="Biography" icon={Pencil} />
                    <textarea
                      value={identity.biography || ""}
                      onChange={(e) => setIdentity((prev) => ({ ...prev, biography: e.target.value }))}
                      className="min-h-24 w-full rounded-2xl border border-indigo-700/20 bg-card px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20"
                      placeholder="Tell patients about your background and expertise..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-3 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Personal Information</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <ReadonlyField label="First Name" icon={User} value={identity.firstName || "Not provided"} />
                      <ReadonlyField label="Last Name" icon={User} value={identity.lastName || "Not provided"} />
                      <ReadonlyField label="Gender" icon={User} value={identity.gender || "Not provided"} />
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-4 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Clinic Information</p>
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
                      <ReadonlyField label="Latitude" icon={Compass} value={identity.latitude} />
                      <ReadonlyField label="Longitude" icon={Compass} value={identity.longitude} />
                      <ReadonlyField
                        label="Telegram"
                        icon={Send}
                        value={`@${identity.telegramUsername}`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <FieldLabel label="Biography" icon={Pencil} />
                    <div className="min-h-20 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground/60 ring-1 ring-border leading-relaxed">
                      {identity.biography || "No biography provided yet."}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Available Days
              </p>
              <div className="flex flex-wrap gap-2">
                {availableDays.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => toggleDay(item.day)}
                    className={`h-8 cursor-pointer rounded-xl border px-4 text-[11px] font-bold transition active:scale-95 disabled:cursor-default ${
                      item.enabled
                        ? "border-indigo-700 bg-indigo-700 text-white shadow-lg shadow-indigo-700/20 dark:bg-indigo-500"
                        : "border-transparent bg-muted text-muted-foreground ring-1 ring-border"
                    }`}
                  >
                    {item.day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Services Section */}
      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Services Offered</h2>
            <p className="text-xs text-muted-foreground">
              Manage the treatments and services provided by your clinic.
            </p>
          </div>
          <button
            onClick={openAddModal}
            disabled={isBusy}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600/10 px-5 text-xs font-bold text-indigo-600 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500/20 dark:text-indigo-400"
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
                    ? "border-indigo-700/20 bg-indigo-700/5 shadow-sm shadow-indigo-700/5 dark:bg-indigo-500/5"
                    : "border-border bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p
                      className={`truncate text-sm font-bold ${
                        service.enabled ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"
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
                        className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-indigo-600/10 hover:text-indigo-600 dark:hover:text-indigo-400"
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
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500"
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
                    <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
                      <span className="text-[10px] text-muted-foreground">$</span>
                      <span>{service.price}</span>
                    </div>
                  )}
                  {service.duration !== undefined && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
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

      {/* Map Preview at the bottom */}
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex h-14 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <MapPin className="size-4" />
            </div>
            <span className="text-sm font-bold text-foreground">Clinic Location</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${identity.latitude},${identity.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-[10px] font-bold text-muted-foreground ring-1 ring-border transition hover:bg-muted/80"
          >
            <Compass className="size-3.5" />
            Open Maps
          </a>
        </div>
        <div className="relative h-[400px] w-full bg-muted">
          <iframe
            title="Clinic Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${identity.latitude},${identity.longitude}&z=15&output=embed`}
            allowFullScreen
            className="dark:invert dark:grayscale dark:brightness-90"
          />
        </div>
      </article>

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
              }
            : null
        }
      />

      <MobileBottomNav active="services" />
    </main>
  );
}
