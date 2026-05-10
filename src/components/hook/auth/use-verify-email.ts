import api from "../../../api/api";
import { API_ENDPOINT } from "../../../api/endpoint";

export default async function verifyEmail(token: string) {
  const res = await api.get(API_ENDPOINT.VERIFY_EMAIL, {
    params: {
      t: token,
    },
    validateStatus: (status) => status < 500,
  });

  return res.data;
}
