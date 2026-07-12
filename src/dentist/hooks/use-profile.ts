import { useQuery } from "@tanstack/react-query";
import { getDentistProfileApi } from "../../api/api";

export default function useProfile() {
 return useQuery({
 queryKey: ["dentist-profile-full"],
 queryFn: async () => {
 // Fetch specific dentist profile
 const dentistRes = await getDentistProfileApi();
 console.log("[useProfile] Dentist Specific Data:", dentistRes.data?.data);
 
 return dentistRes.data?.data || {};
 },
 });
}
