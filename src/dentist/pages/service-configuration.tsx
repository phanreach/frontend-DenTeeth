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
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import ServiceModal, { type ServiceSchema } from "../../components/dentist/service-modal";
import {
  SERVICE_CONFIGURATION_DATA,
  type ClinicIdentity,
  type ServiceItem,
} from "../constants/service-configuration-data";

function FieldLabel({
  label,
  icon: Icon,
}: {
  label: string;
  icon?: LucideIcon;
}) {
  return (
    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
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
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="space-y-1">
      <FieldLabel label={label} icon={icon} />
      <div className="h-11 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm text-neutral-900/60 ring-1 ring-black/5">
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  icon?: LucideIcon;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block space-y-1">
      <FieldLabel label={label} icon={icon} />
      <div className="relative">
        {prefix ? (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
            {prefix}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPaste={onPaste}
          className={`h-11 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20 ${
            prefix ? "pl-8" : ""
          }`}
        />
      </div>
    </label>
  );
}

export default function ServiceConfiguration() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [identity, setIdentity] = useState<ClinicIdentity>(SERVICE_CONFIGURATION_DATA.identity);
  const [availableDays, setAvailableDays] = useState(SERVICE_CONFIGURATION_DATA.availableDays);
  const [servicesOffered, setServicesOffered] = useState(
    SERVICE_CONFIGURATION_DATA.servicesOffered,
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDay = (day: string) => {
    setAvailableDays((days) =>
      days.map((item) => (item.day === day ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const toggleService = (name: string) => {
    setServicesOffered((services) =>
      services.map((service) =>
        service.name === name ? { ...service, enabled: !service.enabled } : service,
      ),
    );
  };

  const handleSaveService = (serviceData: ServiceSchema) => {
    if (editingServiceIndex !== null) {
      // Update existing service
      setServicesOffered((prev) =>
        prev.map((item, index) =>
          index === editingServiceIndex ? { ...item, ...serviceData } : item,
        ),
      );
      toast.success(`${serviceData.name} updated successfully!`);
    } else {
      // Add new service
      setServicesOffered((prev) => [...prev, { ...serviceData, enabled: true }]);
      toast.success(`${serviceData.name} added to services!`);
    }
    setIsModalOpen(false);
    setEditingServiceIndex(null);
  };

  const handleDeleteService = (index: number) => {
    const serviceName = servicesOffered[index].name;
    setServicesOffered((prev) => prev.filter((_, i) => i !== index));
    toast.error(`${serviceName} removed from services.`);
  };

  const openAddModal = () => {
    setEditingServiceIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingServiceIndex(index);
    setIsModalOpen(true);
  };

  const handleProfileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(URL.createObjectURL(file));
    toast.success("Profile photo uploaded successfully!");
  };

  const handleSave = () => {
    if (isEditing) {
      toast.success("Clinic configuration saved successfully!");
    }
    setIsEditing((prev) => !prev);
  };

  const sanitizeCoordinate = (value: string) => {
    return value
      .replace(/[^0-9.-]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/(?!^)-/g, "");
  };

  const handleCoordinatePaste = () => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    const coords = pasteData
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);

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

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  return (
    <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Click Edit to update your clinic profile.
        </p>
        <button
          onClick={handleSave}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-100 px-5 text-xs font-bold text-indigo-700 transition active:scale-95"
        >
          {isEditing ? <Save className="size-4" /> : <Pencil className="size-4" />}
          {isEditing ? "Save Configuration" : "Edit Profile"}
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Clinic Identity & Profile */}
        <div className="lg:col-span-2">
          <article className="h-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="group relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Clinic profile"
                      className="size-32 rounded-3xl border border-black/5 object-cover shadow-inner"
                    />
                  ) : (
                    <div className="grid size-32 place-items-center rounded-3xl border border-black/5 bg-slate-50 text-slate-300">
                      <ImageIcon className="size-12" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 grid place-items-center rounded-3xl bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Camera className="size-6" />
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinic Logo
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">JPG, PNG up to 2MB</p>
                </div>
              </div>

              {/* Identity Fields */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Clinic Identity</h2>
                  <p className="text-xs text-slate-400">Basic information about your practice.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {isEditing ? (
                    <>
                      <EditableField
                        label="Clinic Name"
                        icon={Building2}
                        value={identity.clinicName}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, clinicName: value }))}
                      />
                      <EditableField
                        label="Specialty"
                        icon={Stethoscope}
                        value={identity.specialty}
                        onChange={(value) => setIdentity((prev) => ({ ...prev, specialty: value }))}
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
                      <EditableField
                        label="Available Hours"
                        icon={Clock3}
                        value={identity.availableHours}
                        onChange={(value) =>
                          setIdentity((prev) => ({ ...prev, availableHours: value }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <ReadonlyField
                        label="Clinic Name"
                        icon={Building2}
                        value={identity.clinicName}
                      />
                      <ReadonlyField
                        label="Specialty"
                        icon={Stethoscope}
                        value={identity.specialty}
                      />
                      <div className="md:col-span-2">
                        <ReadonlyField
                          label="Clinic Address"
                          icon={MapPin}
                          value={identity.address}
                        />
                      </div>
                      <ReadonlyField label="Latitude" icon={Compass} value={identity.latitude} />
                      <ReadonlyField label="Longitude" icon={Compass} value={identity.longitude} />
                      <ReadonlyField
                        label="Telegram Username"
                        icon={Send}
                        value={`@${identity.telegramUsername}`}
                      />
                      <ReadonlyField
                        label="Available Hours"
                        icon={Clock3}
                        value={identity.availableHours}
                      />
                    </>
                  )}
                </div>

                {/* Available Days */}
                <div className="border-t border-black/5 pt-4">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Available Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map((item) => (
                      <button
                        key={item.day}
                        disabled={!isEditing}
                        onClick={() => toggleDay(item.day)}
                        className={`h-8 cursor-pointer rounded-xl border px-4 text-[11px] font-bold transition active:scale-95 disabled:cursor-default ${
                          item.enabled
                            ? "border-indigo-700 bg-indigo-700 text-white shadow-lg shadow-indigo-700/20"
                            : "border-transparent bg-slate-50 text-slate-400 ring-1 ring-black/5"
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
        </div>

        {/* Right Column: Location Preview */}
        <div>
          <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex h-14 items-center justify-between border-b border-black/5 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-xl bg-violet-100 text-indigo-700">
                  <MapPin className="size-4" />
                </div>
                <span className="text-sm font-bold text-neutral-900">Clinic Location</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${identity.latitude},${identity.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-50 px-3 text-[10px] font-bold text-slate-500 ring-1 ring-black/5 transition hover:bg-slate-100"
              >
                <Compass className="size-3.5" />
                Open Maps
              </a>
            </div>
            <div className="relative h-[477px] w-full bg-slate-50">
              <iframe
                title="Clinic Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${identity.latitude},${identity.longitude}&z=15&output=embed`}
                allowFullScreen
              />
            </div>
          </article>
        </div>
      </section>

      {/* Services Section */}
      <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Services Offered</h2>
            <p className="text-xs text-slate-400">
              Manage the treatments and services provided by your clinic.
            </p>
          </div>
          <button
            disabled={!isEditing}
            onClick={openAddModal}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-violet-100 px-5 text-xs font-bold text-indigo-700 transition active:scale-95 disabled:cursor-default disabled:opacity-50"
          >
            <Plus className="size-4" />
            Add New Service
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {servicesOffered.map((service, index) => (
            <div
              key={service.name}
              className={`group flex flex-col rounded-2xl border p-4 transition ${
                service.enabled
                  ? "border-indigo-700/20 bg-indigo-700/5 shadow-sm shadow-indigo-700/5"
                  : "border-black/5 bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className={`truncate text-sm font-bold ${
                      service.enabled ? "text-indigo-700" : "text-neutral-900"
                    }`}
                  >
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="line-clamp-2 leading-relaxed text-[11px] font-medium text-slate-400">
                      {service.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => openEditModal(index)}
                        className="grid size-8 cursor-pointer place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(index)}
                        className="grid size-8 cursor-pointer place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    disabled={!isEditing}
                    onClick={() => toggleService(service.name)}
                    className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-xl transition disabled:cursor-default ${
                      service.enabled
                        ? "bg-indigo-700 text-white shadow-lg shadow-indigo-700/30"
                        : "bg-slate-100 text-slate-400"
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

              <div className="mt-4 flex items-center gap-4 border-t border-black/5 pt-3">
                {service.price !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
                    <span className="text-[10px] text-slate-400">$</span>
                    <span>{service.price}</span>
                  </div>
                )}
                {service.duration !== undefined && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <Clock3 className="size-3.5" />
                    <span>{service.duration} min</span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
