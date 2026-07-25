import type { Diagnosis } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";
import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";

export type DiagnosisResponse = {
  success: boolean;
  code: string;
  status: number;
  message: string;
  data: Diagnosis[];
};

export default function useDiagnosisQuery() {
  return useQuery({
    queryKey: [QUERY_KEY_ENUM.DIAGNOSIS],
    queryFn: async () => {
      const res = await api.get<DiagnosisResponse>(API_ENDPOINT.DIAGNOSIS);

      return res.data.data;
    },
  });
}
