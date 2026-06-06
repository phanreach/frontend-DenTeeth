import UseDentistQuery from "@/components/hook/use-dentist-query";
import DentistBio from "../components/dentist-bio";
import { useParams } from "react-router-dom";

export default function DentistDetail() {
  const { data = [] } = UseDentistQuery();
  const { dentistId } = useParams();
  const dentist = data.find((item) => item.id === Number(dentistId));
  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-jci-primary-dark">
              Dentist Profile & Booking
            </h1>
            <p className="text-sm text-gray-500">
              Manage your upcoming visits and professional consultations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {dentist ? (
          <DentistBio data={dentist} />
        ) : (
          <p className="text-sm text-gray-500">Dentist not found.</p>
        )}
      </div>
    </div>
  );
}
