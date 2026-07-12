import { useQuery } from "@tanstack/react-query";
import { getDentistReviewsApi } from "../../api/api";

export default function useDentistReviews() {
 return useQuery({
 queryKey: ["dentist-reviews"],
 queryFn: async () => {
 const response = await getDentistReviewsApi();
 return response.data;
 },
 });
}
