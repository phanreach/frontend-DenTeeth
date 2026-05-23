import UseDentistQuery from "@/components/hook/use-dentist-query";
import DentistBio from "../components/dentist-bio";

export default function DentistDetail() {
  const { data = [] } = UseDentistQuery();
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
        {data.map((dentist) => (
          <DentistBio data={dentist} key={dentist.id} />
        ))}
      </div>
    </div>
  );
}
