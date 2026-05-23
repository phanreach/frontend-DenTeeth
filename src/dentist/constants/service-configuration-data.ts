export interface ClinicIdentity {
  clinicName: string;
  specialty: string;
  address: string;
  latitude: string;
  longitude: string;
  telegramUsername: string;
  availableHours: string;
}

export interface ServiceConfigurationData {
  profile: {
    imageHint: string;
    uploadHint: string;
  };
  identity: ClinicIdentity;
  availableDays: Array<{ day: string; enabled: boolean }>;
  servicesOffered: Array<{ name: string; enabled: boolean }>;
}

export const SERVICE_CONFIGURATION_DATA: ServiceConfigurationData = {
  profile: {
    imageHint: "No profile image uploaded",
    uploadHint: "JPG or PNG, max 2MB",
  },
  identity: {
    clinicName: "Dr. Miller's Clinic",
    specialty: "General Dentistry",
    address: "Full clinic address",
    latitude: "40.7128",
    longitude: "-74.0060",
    telegramUsername: "yourusername",
    availableHours: "09:00 AM - 06:00 PM",
  },
  availableDays: [
    { day: "Mon", enabled: true },
    { day: "Tue", enabled: true },
    { day: "Wed", enabled: true },
    { day: "Thu", enabled: true },
    { day: "Fri", enabled: true },
    { day: "Sat", enabled: false },
    { day: "Sun", enabled: false },
  ],
  servicesOffered: [
    { name: "Scaling & Polishing", enabled: true },
    { name: "Root Canal Treatment", enabled: false },
    { name: "Teeth Whitening", enabled: true },
    { name: "Dental Fillings", enabled: false },
    { name: "Extractions", enabled: false },
    { name: "Orthodontics", enabled: false },
    { name: "Dental Implants", enabled: false },
    { name: "Pediatric Dentistry", enabled: false },
  ],
};
