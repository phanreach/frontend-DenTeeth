import UseDentistQuery from "@/components/hook/use-dentist-query";
import Pagination from "@/components/pagination";
import DentistCard from "@/landing/dentist-card";
import { useState } from "react";

export default function FindDentist() {
  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const { data = [], isLoading } = UseDentistQuery();

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const visiblePage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage;

  const startIndex = (visiblePage - 1) * itemsPerPage;

  const currentDentists = data.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-jci-primary-dark">
              Find a Dentist
            </h1>
            <p className="text-sm text-gray-500">
              Manage your upcoming visits and professional consultations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
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
    </div>
  );
}
