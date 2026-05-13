import { Calendar, Clock, MapPin, Star } from "lucide-react";
import type { dentist } from "../dentist/types/api";

export default function DentistCard({ data }: { data: dentist }) {
  return (
    <div className="rounded-2xl bg-white overflow-hidden border border-gray-100 max-w-xs shadow-md">
      {/* Image + Badge */}
      <div className="relative">
        <img
          src={data.profilePictureUrl}
          alt="Dentist with patient"
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
          Available
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Name + Rating */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-base font-semibold text-gray-900">{data.name}</p>
            <p className="text-sm font-medium text-blue-600 mt-0.5">
              {data.specialty}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-sm font-medium text-gray-800">
              {data.rating}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 py-3 border-t border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">{data.address}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">{data.hours}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">{data.availability}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Consultation fee
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {data.consultationFee}
            </p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150">
            Book visit
          </button>
        </div>
      </div>
    </div>
  );
}
