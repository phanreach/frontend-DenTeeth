import { useState } from "react";
import DentistCard from "./dentist-card";
import Footer from "../components/footer";
import Navbar from "../components/nav-bar";
import Pagination from "../components/pagination";
import UseDentistQuery from "../components/hook/use-dentist-query";
import DentistCardSkeleton from "@/components/dentist-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dentist() {
  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const { data = [], isLoading, isError } = UseDentistQuery();

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const visiblePage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage;

  const startIndex = (visiblePage - 1) * itemsPerPage;

  const currentDentists = data.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef3ff]">
        <Navbar />

        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <div className="mb-8 space-y-3">
            <Skeleton className="h-10 w-96 max-w-full" />
            <Skeleton className="h-5 w-60" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <DentistCardSkeleton key={index} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Failed to load dentists
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3ff]">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            Recommended Dental Care
          </h1>

          <p className="text-gray-500">Meet professionals in your area</p>
        </div>

        {currentDentists.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentDentists.map((dentist) => (
              <DentistCard key={dentist.id} data={dentist} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-blue-100 bg-white p-8 text-center text-gray-500">
            No dentists available yet.
          </div>
        )}

        <div className="mt-12">
          <Pagination
            currentPage={visiblePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
