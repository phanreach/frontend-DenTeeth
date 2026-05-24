import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  Clock3,
  Compass,
  ImageIcon,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  Save,
  Send,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import L from "leaflet";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import {
  SERVICE_CONFIGURATION_DATA,
  type ClinicIdentity,
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
      <div className="h-11 rounded-2xl bg-slate-100 px-3.5 py-3 text-sm text-neutral-900/60">
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  icon?: LucideIcon;
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
          className={`h-11 w-full rounded-2xl border border-indigo-700/20 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/20 ${
            prefix ? "pl-8" : ""
          }`}
        />
      </div>
    </label>
  );
}

function ClinicMap({ lat, lon }: { lat: number; lon: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      pane: "overlayPane",
    }).addTo(map);

    L.circleMarker([lat, lon], {
      radius: 10,
      fillColor: "#7C3AED",
      color: "#ffffff",
      weight: 3,
      opacity: 1,
      fillOpacity: 1,
    }).addTo(map);

    L.circleMarker([lat, lon], {
      radius: 18,
      fillColor: "#7C3AED",
      color: "#7C3AED",
      weight: 1,
      opacity: 0.25,
      fillOpacity: 0.12,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default function ServiceConfiguration() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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

  const handleProfileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const latitude = Number.parseFloat(identity.latitude);
  const longitude = Number.parseFloat(identity.longitude);
  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const openStreetMapUrl = hasValidCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : "https://www.openstreetmap.org";

  return (
    <main className="mx-auto w-full max-w-md space-y-5 px-4 pb-24 lg:mx-0 lg:max-w-none lg:px-6 lg:pb-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <section className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold leading-8 text-neutral-900 lg:text-4xl"
            style={{ fontFamily: "'Fraunces', 'DM Serif Display', Georgia, serif" }}
          >
            Service Configuration
          </h1>
          <p className="mt-2 text-sm text-slate-500">Click Edit to update your clinic profile.</p>
        </div>

        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-violet-100 px-3 text-xs font-semibold text-indigo-700"
        >
          {isEditing ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
          {isEditing ? "Save" : "Edit"}
        </button>
      </section>

      <section className="space-y-5">
        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-900">Profile Picture</h2>
          <div className="mt-3 flex items-center gap-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Clinic profile"
                className="size-20 rounded-2xl border border-black/10 object-cover"
              />
            ) : (
              <div className="grid size-20 place-items-center rounded-2xl border border-black/10 bg-slate-100 text-slate-400">
                <ImageIcon className="size-8" />
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleProfileUpload}
                className="hidden"
              />
              <button
                disabled={!isEditing}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-8 items-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-500 disabled:opacity-50"
              >
                <Camera className="size-3.5" />
                Upload Photo
              </button>
              <p className="mt-2 text-xs text-slate-500">{SERVICE_CONFIGURATION_DATA.profile.uploadHint}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-900">Clinic Identity</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
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
                  onChange={(value) => setIdentity((prev) => ({ ...prev, latitude: value }))}
                />
                <EditableField
                  label="Longitude"
                  icon={Compass}
                  value={identity.longitude}
                  onChange={(value) => setIdentity((prev) => ({ ...prev, longitude: value }))}
                />
                <EditableField
                  label="Telegram Username"
                  icon={Send}
                  value={identity.telegramUsername}
                  prefix="@"
                  onChange={(value) =>
                    setIdentity((prev) => ({ ...prev, telegramUsername: value.replace(/^@/, "") }))
                  }
                />
                <EditableField
                  label="Available Hours"
                  icon={Clock3}
                  value={identity.availableHours}
                  onChange={(value) => setIdentity((prev) => ({ ...prev, availableHours: value }))}
                />
              </>
            ) : (
              <>
                <ReadonlyField label="Clinic Name" icon={Building2} value={identity.clinicName} />
                <ReadonlyField label="Specialty" icon={Stethoscope} value={identity.specialty} />
                <div className="md:col-span-2">
                  <ReadonlyField label="Clinic Address" icon={MapPin} value={identity.address} />
                </div>
                <ReadonlyField label="Latitude" icon={Compass} value={identity.latitude} />
                <ReadonlyField label="Longitude" icon={Compass} value={identity.longitude} />
                <ReadonlyField
                  label="Telegram Username"
                  icon={Send}
                  value={`@${identity.telegramUsername}`}
                />
                <ReadonlyField label="Available Hours" icon={Clock3} value={identity.availableHours} />
              </>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-900">Available Days</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableDays.map((item) => (
              <button
                key={item.day}
                disabled={!isEditing}
                onClick={() => toggleDay(item.day)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  item.enabled
                    ? "border-indigo-700 bg-indigo-700 text-white"
                    : "border-transparent bg-slate-100 text-slate-500"
                } disabled:cursor-default`}
              >
                {item.day}
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Services Offered</h2>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {servicesOffered.map((service) => (
              <button
                key={service.name}
                disabled={!isEditing}
                onClick={() => toggleService(service.name)}
                className={`inline-flex h-9 items-center justify-between rounded-2xl border px-3 transition disabled:cursor-default ${
                  service.enabled
                    ? "border-indigo-700/40 bg-indigo-700/5 text-indigo-700"
                    : "border-transparent bg-slate-100 text-slate-500"
                }`}
              >
                <span className="text-xs font-medium">{service.name}</span>
                {service.enabled ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
              </button>
            ))}
          </div>
        </article>

        <article className="h-80 overflow-hidden rounded-2xl border bg-white p-px">
          <div className="flex h-16 items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-violet-100 text-violet-600">
                <MapPinned className="size-3" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Clinic Location</h2>
                <p className="font-mono text-xs text-slate-500">
                  {hasValidCoordinates
                    ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                    : "Enter valid latitude and longitude to preview the map"}
                </p>
              </div>
            </div>

            <a
              href={openStreetMapUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex h-7 items-center gap-1 rounded-full px-3 text-xs font-semibold ${
                hasValidCoordinates
                  ? "bg-violet-100 text-indigo-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <MapPin className="size-3" />
              Open in Maps
            </a>
          </div>

          <div className="relative h-64 overflow-hidden bg-neutral-200">
            {hasValidCoordinates ? (
              <>
                <ClinicMap lat={latitude} lon={longitude} />
              </>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">
                Latitude must be between -90 and 90, and longitude between -180 and 180.
              </div>
            )}
            <div className="absolute bottom-1 right-2 bg-white/75 px-1.5 py-0.5 text-[10px] text-slate-400">
              © OpenStreetMap, © CARTO
            </div>
          </div>
        </article>
      </section>

      <MobileBottomNav active="services" />
    </main>
  );
}
