export type service = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: string;
  imageUrl: string[];
};

export type dentist = {
  id: number;
  name: string;
  gender: string;
  photoUrl: string;
  biography: string;
  clinicName: string;
  profession: string;
  yearsOfExperience: number;
  priceRange: string[];
  specialty: string;
  rating: string;
  address: string;
  hours: string;
  availability: string;
  services: service[];
};
