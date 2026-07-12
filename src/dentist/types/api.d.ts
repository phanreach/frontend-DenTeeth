export type dentist = {
 id: number;
 name: string;
 specialty: string;
 experience: number; // in years
 rating: number; // average rating out of 5
 profilePictureUrl: string;
 location: string;
 email: string;
 phone: string;
 availableSlots: string[]; // e.g., ["2024-07-01T10:00", "2024-07-01T11:00"]
 address: string;
 hours: string; // e.g., "Mon-Fri 9am-5pm"
 availability: string; // e.g., "Available for appointments"
 consultationFee: string; // e.g., "$100"
};
