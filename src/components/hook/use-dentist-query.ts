import { API_ENDPOINT } from "../../api/endpoint";
import type { dentist } from "../../types/api";

import api from "../../api/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

type DentistApiResponse = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: dentist[];
};

export default function UseDentistQuery() {
  const apiFn = async (): Promise<dentist[]> => {
    const res = await api.get<DentistApiResponse | dentist[]>(
      API_ENDPOINT.DENTIST,
    );

    if (Array.isArray(res.data)) {
      return res.data;
    }

    return res.data.data ?? [];
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.DENTIST],
    queryFn: apiFn,
  });
}
