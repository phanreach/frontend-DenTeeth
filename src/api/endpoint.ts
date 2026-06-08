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


  //? DENTIST ROLE

  // APPOINTMENT
  GET_ALL_APPOINTMENTS_STATUS: "/appointment/dentist/status",
  GET_MY_APPOINTMENTS: "/appointment/my-appointments", //!Done
  UPDATE_APPOINTMENT_STATUS: (id: number) => `/appointment/dentist/update-status/${id}`, //!Done
  RESCHEDULE_APPOINTMENT: (id: number) => `/appointment/dentist/reschedule/${id}`, //!Done
  
  //SERVICE
  GET_ALL_SERVICES: (dentistId: number) => `/dental/service/${dentistId}`, //!Done
  CREATE_SERVICE: "/dental/service/create", //!Doone
  UPDATE_SERVICE: (id: number) => `/dental/service/update/${id}`, //!Done
  DELETE_SERVICE: (id: number) => `/dental/service/delete/${id}`, //!Done
  SET_OPERATION_HOURS:  "/dental/operation-hour/create",
  GET_OPERATION_HOURS: (dentistId: number) => `/dental/operation-hour/${dentistId}`,


  //profile
  GET_DENTIST_PROFILE: "/profile/dentist/me", //!Done - but need POST endpoint for update
  UPLOAD_PROFILE_PICTURE: "/profile/dentist/photo/upload",
};
