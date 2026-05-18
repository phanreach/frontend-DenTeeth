export const QUERY_KEY_ENUM = {
  DENTIST: "DENTIST",
} as const;

export type QUERY_KEY_ENUM = keyof typeof QUERY_KEY_ENUM;
