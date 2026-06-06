import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

export type ReviewPayload = {
  dentalServiceId: number;
  rating: string;
  content: string;
};

type ReviewResponse<T = unknown> = {
  success: boolean;
  code?: string;
  status: number;
  message: string;
  data: T;
};

export default function useReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const res = await api.post<ReviewResponse>(
        API_ENDPOINT.CREATE_REVIEW,
        payload,
      );
      return res.data;
    },
    onMutate: () => {
      const toastId = toast.loading("Creating review...");
      return { toastId };
    },

    onSuccess: (response, _variables, context) => {
      toast.success(response.message || "Review created successfully", {
        id: context?.toastId,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.REVIEW],
      });
    },

    onError: (_error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });
}
