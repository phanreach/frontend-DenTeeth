import api from "../../../api/api";
import { API_ENDPOINT } from "../../../api/endpoint";

export default async function checkVerification(email: string) {
  const res = await api.get(API_ENDPOINT.CHECK_VERIFICATION, {
    params: {
      email,
    },
    validateStatus: (status) => status < 500,
  });

  return res.data;
}
