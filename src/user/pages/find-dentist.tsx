import UseDentistQuery from "@/components/hook/use-dentist-query";
import Pagination from "@/components/pagination";
import DentistCard from "@/landing/dentist-card";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import Filter, { type DentistFilterValue } from "../components/filter";

const DEFAULT_DENTIST_FILTER: DentistFilterValue = {
  specialties: [],
  maxPrice: 1500,
};

export default function FindDentist() {
  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<DentistFilterValue>(
    DEFAULT_DENTIST_FILTER,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data = [], isLoading } = UseDentistQuery();

  const availableSpecialties = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((dentist) => dentist.specialty ?? dentist.profession)
          .filter((specialty): specialty is string => Boolean(specialty)),
      ),
    ).sort((first, second) => first.localeCompare(second));
  }, [data]);

  const maxFilterPrice = useMemo(() => {
    const highestPrice = data.reduce((highest, dentist) => {
      const dentistMaxPrice =
        dentist.priceRange?.[1] ?? dentist.priceRange?.[0];

      return Math.max(highest, dentistMaxPrice ?? 0);
    }, DEFAULT_DENTIST_FILTER.maxPrice);

    return Math.max(DEFAULT_DENTIST_FILTER.maxPrice, highestPrice);
  }, [data]);

  const filteredDentists = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return data.filter((dentist) => {
      const dentistSpecialty = dentist.specialty ?? dentist.profession;
      const serviceNames = dentist.services?.map((service) => service.name) ?? [];

      const matchesSearch =
        !query ||
        [
          dentist.name,
          dentistSpecialty,
          dentist.clinicName,
          ...serviceNames,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesSpecialty =
        filters.specialties.length === 0 ||
        (dentistSpecialty
          ? filters.specialties.includes(dentistSpecialty)
          : false);

      const dentistMaxPrice =
        dentist.priceRange?.[1] ?? dentist.priceRange?.[0] ?? 0;
      const matchesPrice = dentistMaxPrice <= filters.maxPrice;

      return matchesSearch && matchesSpecialty && matchesPrice;
    });
  }, [data, filters, searchTerm]);

  const totalPages = Math.ceil(filteredDentists.length / itemsPerPage);

  const visiblePage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage;

  const startIndex = (visiblePage - 1) * itemsPerPage;

  const currentDentists = filteredDentists.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleApplyFilters = (nextFilters: DentistFilterValue) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="border-b bg-white">
        <div className="mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-jci-primary-dark">
            Find a Dentist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Discover trusted dental professionals for your treatment and care.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* FILTER SIDEBAR */}
          <div className="h-fit lg:sticky lg:top-24">
            <Filter
              availableSpecialties={availableSpecialties}
              value={filters}
              onApply={handleApplyFilters}
              maxPrice={maxFilterPrice}
            />
          </div>

          {currentDentists.length > 0 ? (
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {currentDentists.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredDentists.length}
                  </span>{" "}
                  dentists
                </p>

                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name, specialist, service..."
                    className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {currentDentists.map((dentist) => (
                  <DentistCard key={dentist.id} data={dentist} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="mt-10">
                <Pagination
                  currentPage={visiblePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-end">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name, specialist, service..."
                    className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  No dentists found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or adjusting your filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
