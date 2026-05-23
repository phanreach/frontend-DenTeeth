export const QUERY_KEY_ENUM = {
  DENTIST: "DENTIST",
  APPOINTMENT: "APPOINMENT",
} as const;

export type QUERY_KEY_ENUM = keyof typeof QUERY_KEY_ENUM;
