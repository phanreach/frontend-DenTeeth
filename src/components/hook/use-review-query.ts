import api from "@/api/api";
import { API_ENDPOINT } from "@/api/endpoint";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_ENUM } from "../constants/query-key-enums";

export type ReviewData = {
  id: number;
  dentalServiceId?: number;
  serviceId?: number;
  dentalService?: {
    id?: number;
  };
  rating: number | string;
  content: string;
  createdAt?: string;
  patientName?: string;
  patient?: {
    name?: string;
  };
};

type ReviewApiResponse = {
  success: boolean;
  code?: string;
  status: number;
  message: string;
  data: ReviewData[];
};

const getReviewServiceId = (review: ReviewData) =>
  review.dentalServiceId ?? review.serviceId ?? review.dentalService?.id;

export default function useReviewQuery(selectedService: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY_ENUM.REVIEW, selectedService],
    enabled: Boolean(selectedService),
    queryFn: async () => {
      const res = await api.get<ReviewApiResponse | ReviewData[]>(
        API_ENDPOINT.GET_PATIENT_REVIEWS,
      );

      const reviews = Array.isArray(res.data) ? res.data : (res.data.data ?? []);

      return reviews.filter(
        (review) => getReviewServiceId(review) === selectedService,
      );
    },
  });
}
