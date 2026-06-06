export interface ClinicIdentity {
  clinicName: string;
  specialty: string;
  address: string;
  latitude: string;
  longitude: string;
  telegramUsername: string;
  availableHours: string;
}

export interface ServiceItem {
  name: string;
  enabled: boolean;
  description?: string;
  price?: number;
  duration?: number;
}

export interface ServiceConfigurationData {
  profile: {
    imageHint: string;
    uploadHint: string;
  };
  identity: ClinicIdentity;
  availableDays: Array<{ day: string; enabled: boolean }>;
  servicesOffered: ServiceItem[];
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
    { name: "Scaling & Polishing", enabled: true, description: "Professional cleaning of teeth", price: 50, duration: 30 },
    { name: "Root Canal Treatment", enabled: false, description: "Treatment for infected tooth pulp", price: 300, duration: 60 },
    { name: "Teeth Whitening", enabled: true, description: "Professional teeth whitening", price: 150, duration: 45 },
    { name: "Dental Fillings", enabled: false, description: "Restoring decayed teeth", price: 80, duration: 30 },
    { name: "Extractions", enabled: false, description: "Safe removal of teeth", price: 100, duration: 30 },
    { name: "Orthodontics", enabled: false, description: "Braces and aligners", price: 2000, duration: 60 },
    { name: "Dental Implants", enabled: false, description: "Tooth replacement", price: 1500, duration: 90 },
    { name: "Pediatric Dentistry", enabled: false, description: "Dental care for children", price: 60, duration: 30 },
  ],
};
