import type { dentist } from "@/types/api";
import ServiceCard from "./service-card";
import { Award, HeartHandshake, Star, UsersRound } from "lucide-react";
import { useState, useRef } from "react";
import AppointmentForm from "./appointment-form";
import ReviewCard from "./review-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import type { service } from "@/types/api";

export default function DentistBio({ data }: { data: dentist }) {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [dialogService, setDialogService] = useState<service | null>(null);
  const firstLetter = data.name?.trim().charAt(0).toUpperCase() ?? "?";
  const appointmentRef = useRef<HTMLDivElement | null>(null);
  const displayedServices = showAllServices
    ? data.services
    : data.services?.slice(0, 4);
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-end gap-4 mb-5">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="h-20 w-20 flex-shrink-0 rounded-full border-[3px] border-white object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
                  {" "}
                  {firstLetter}
                </div>
              )}
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="truncate text-xl font-semibold text-gray-900">
                  {data.name}
                </h1>
                <p className="mt-0.5 text-sm text-primary">
                  {data.profession ??
                    "Senior Orthodontist & Cosmetic Specialist"}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 pb-2">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-medium text-primary">
                  {data.rating ?? "4.9"}
                </span>
                <span className="text-xs text-primary">· 120+ reviews</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1.5 rounded-xl bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Experience
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {data.yearsOfExperience} years
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-xl bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <UsersRound className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Patients
                </p>
                <p className="text-base font-semibold text-gray-900">2.5k+</p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-xl bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <HeartHandshake className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Satisfaction
                </p>
                <p className="text-base font-semibold text-gray-900">98%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Biography
          </h2>

          <p className="leading-relaxed text-gray-500">{data.biography}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Browse available dental treatments and procedures.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {displayedServices?.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setDialogService(service);
                }}
                className={`cursor-pointer rounded-2xl transition ${
                  selectedService === service.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <ServiceCard data={service} />
              </div>
            ))}
          </div>
          {data.services && data.services.length > 4 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllServices(!showAllServices)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                <span>
                  {showAllServices ? "Show Less" : "View More Services"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    showAllServices ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={appointmentRef}>
        <AppointmentForm data={data} selectedService={selectedService} />
      </div>
      <ReviewCard
        key={selectedService ?? "no-selected-service"}
        selectedService={selectedService}
      />
      <Dialog open={!!dialogService} onOpenChange={(open) => !open && setDialogService(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 border-0 overflow-x-hidden">
          {dialogService && (
            <div className="flex flex-col">
              <img
                src={
                  dialogService.imageUrl ||
                  "https://quintessencedental.com/wp-content/uploads/2025/07/Dental-Clinic-Interior-Design-jpg.webp"
                }
                alt={dialogService.name}
                className="w-full h-56 object-cover rounded-t-xl"
              />
              <div className="p-6 pb-2">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">{dialogService.name}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 whitespace-pre-wrap mt-3 leading-relaxed">
                    {dialogService.description}
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              <div className="flex justify-between items-center px-6 py-4 mt-2 border-y border-gray-100 bg-gray-50/50">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Price</p>
                  <p className="font-bold text-primary text-lg">${dialogService.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{dialogService.durationInMinutes} mins</p>
                </div>
              </div>
              
              <DialogFooter className="p-6 bg-white border-t-0 sm:justify-center">
                <button
                  onClick={() => {
                    setSelectedService(dialogService.id);
                    setDialogService(null);
                    if (window.innerWidth < 1024) {
                      appointmentRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-blue-700 active:scale-95 shadow-md shadow-primary/20"
                >
                  Select this service
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
