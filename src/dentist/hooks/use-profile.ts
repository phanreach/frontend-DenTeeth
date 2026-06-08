import { useQuery } from "@tanstack/react-query";
import { getDentistProfileApi, meApi } from "../../api/api";

export default function useProfile() {
  return useQuery({
    queryKey: ["dentist-profile-full"],
    queryFn: async () => {
      // Fetch both specific dentist profile AND base user profile to see where the image is stored
      const [dentistRes, userRes] = await Promise.all([
        getDentistProfileApi(),
        meApi()
      ]);
      
      console.log("[useProfile] Dentist Specific Data:", dentistRes.data.data);
      console.log("[useProfile] Base User Auth Data:", userRes.data.data);
      
      // Combine them, giving priority to dentist specific fields
      return {
        ...userRes.data.data,
        ...dentistRes.data.data,
      };
    },
  });
}
