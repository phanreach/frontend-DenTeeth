import { useState } from "react";
import DentistCard from "./dentist-card";
import Footer from "../components/footer";
import Navbar from "../components/nav-bar";
import Pagination from "../components/pagination";
import { dentists } from "../components/constants/data-dummy";

export default function Dentist() {
  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dentists.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDentists = dentists.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#eef3ff]">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            Recommended Dental Care
          </h1>

          <p className="text-gray-500">Meet professionals in your area</p>
        </div>

        {/* Dentist Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentDentists.map((dentist) => (
            <DentistCard key={dentist.id} data={dentist} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
