import type { service } from "@/types/api";

export default function ServiceCard({ data }: { data: service }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <img
        src={
          data.imageUrl ||
          "https://quintessencedental.com/wp-content/uploads/2025/07/Dental-Clinic-Interior-Design-jpg.webp"
        }
        alt={data.name}
        className="h-60 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 space-y-3">
          <h3 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-gray-900">
            {data.name}
          </h3>

          <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-500">
            {data.description}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-primary">${data.price}</p>

            <p className="text-sm text-gray-500">
              {data.durationInMinutes} mins
            </p>
          </div>

          <button className="mt-4 w-full rounded-lg bg-primary py-2.5 font-medium text-white transition hover:bg-blue-700">
            Select Service
          </button>
        </div>
      </div>
    </div>
  );
}
