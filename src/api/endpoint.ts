export const API_ENDPOINT = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify",
  CHECK_VERIFICATION: "/auth/check-verification",
  RESEND_VERIFICATION: "/auth/resend-verification",

  //dentist
  DENTIST: "/dental/public/service/all",

  //appointment
  CREATE_APPOINTMENT: "/appointment/patient/create",
  GET_PATIENT_APPOINTMENTS: "/appointment/my-appointments",
  UPDATE_APPOINTMENT: (id: number) => `/appointment/patient/update/${id}`,
  DELETE_APPOINTMENT: (id: number) => `/appointment/patient/delete/${id}`,

  //review
  CREATE_REVIEW: "/review/patient/create",
  GET_PATIENT_REVIEWS: "/review/patient/my-reviews",
};
