export const API_ENDPOINT = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  PROFILE: "/profile/me",
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
  GET_MY_APPOINTMENTS: "/appointment/my-appointments",
  UPDATE_APPOINTMENT_STATUS: (id: number) => `/appointment/dentist/update-status/${id}`,
  RESCHEDULE_APPOINTMENT: (id: number) => `/appointment/dentist/reschedule/${id}`, 
  
  //SERVICE
  GET_ALL_SERVICES: (dentistId: number) => `/dental/service/${dentistId}`,
  CREATE_SERVICE: "/dental/service/create",
  UPDATE_SERVICE: (id: number) => `/dental/service/update/${id}`,
  DELETE_SERVICE: (id: number) => `/dental/service/delete/${id}`,
  SET_OPERATION_HOURS:  "/dental/operation-hour/create",
  GET_OPERATION_HOURS: (dentistId: number) => `/dental/operation-hour/${dentistId}`,


  //profile
  GET_DENTIST_PROFILE: "/profile/dentist/me",
  UPDATE_DENTIST_PROFILE: "/profile/dentist/update",
  UPLOAD_PROFILE_PICTURE: "/profile/dentist/photo/upload",
  DELETE_PROFILE_PICTURE: "/profile/dentist/photo",

  // operation hours updates
  UPDATE_OPERATION_HOUR: (id: number) => `/dental/operation-hour/update/${id}`,
  DELETE_OPERATION_HOUR: (id: number) => `/dental/operation-hour/delete/${id}`,

  // appointment details
  GET_APPOINTMENT_DETAILS: (id: number) => `/appointment/${id}`,
  GET_DENTIST_DASHBOARD: "/dashboard/dentist",
  GET_DENTIST_REVIEWS: "/review/dentist/my-services",
  GET_MY_SESSIONS: "/users/my-sessions",
};
