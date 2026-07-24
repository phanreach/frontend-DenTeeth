import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";
import api from "@/api/api";
import type { Diagnosis } from "@/types/api";

export type DiagnosisPayload = {
  file: File;
};

type DiagnosisApiResponse = {
  success: boolean;
  code?: string;
  status: number;
  message: string;
  data: Diagnosis;
};

type RawDiagnosisApiResponse =
  | DiagnosisApiResponse
  | (Omit<DiagnosisApiResponse, "data"> & {
      data: Diagnosis | { diagnosis: Diagnosis };
    })
  | Diagnosis;

function isDiagnosis(value: unknown): value is Diagnosis {
  return (
    typeof value === "object" &&
    value !== null &&
    "diagnosisId" in value &&
    "imageUrl" in value
  );
}

function normalizeDiagnosisResponse(
  response: RawDiagnosisApiResponse,
): DiagnosisApiResponse {
  if (isDiagnosis(response)) {
    return {
      success: true,
      status: 200,
      message: "Dental scan analyzed successfully.",
      data: response,
    };
  }

  const data = response.data;

  if (isDiagnosis(data)) {
    return {
      ...response,
      data,
    };
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "diagnosis" in data &&
    isDiagnosis(data.diagnosis)
  ) {
    return {
      ...response,
      data: data.diagnosis,
    };
  }

  throw new Error("The diagnosis response was not in the expected format.");
}

export default function useDiagnosisMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: DiagnosisPayload) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post<RawDiagnosisApiResponse>(
        API_ENDPOINT.ADD_DIAGNOSIS,
        formData,
      );

      return normalizeDiagnosisResponse(response.data);
    },

    onMutate: () => {
      const toastId = toast.loading("Analyzing dental scan...");

      return {
        toastId,
      };
    },

    onSuccess: (response, _, context) => {
      toast.success(response.message, {
        id: context?.toastId,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.DIAGNOSIS],
      });
    },

    onError: (error, _, context) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze image",
        {
          id: context?.toastId,
        },
      );
    },
  });
}
