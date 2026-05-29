import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export type DentistFilterValue = {
  specialties: string[];
  maxPrice: number;
};

type FilterProps = {
  availableSpecialties: string[];
  value: DentistFilterValue;
  onApply: (value: DentistFilterValue) => void;
  maxPrice?: number;
  minPrice?: number;
};

const DEFAULT_DENTIST_FILTER: DentistFilterValue = {
  specialties: [],
  maxPrice: 500,
};

export default function Filter({
  availableSpecialties,
  value,
  onApply,
  maxPrice = DEFAULT_DENTIST_FILTER.maxPrice,
  minPrice = 20,
}: FilterProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    value.specialties,
  );

  const [priceRange, setPriceRange] = useState([value.maxPrice]);

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((item) => item !== specialty)
        : [...prev, specialty],
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setPriceRange([maxPrice]);
    onApply({ specialties: [], maxPrice });
  };

  const applyFilters = () => {
    onApply({
      specialties: selectedSpecialties,
      maxPrice: priceRange[0] ?? maxPrice,
    });
  };

  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>

        <button
          onClick={clearFilters}
          className="text-sm font-medium text-primary transition hover:opacity-80"
        >
          Clear all
        </button>
      </div>

      {/* SPECIALTY */}
      <div className="border-b border-gray-100 pb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-800">
          Specialty
        </h3>

        <div className="space-y-4">
          {availableSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center justify-between">
              <label
                htmlFor={specialty}
                className="flex cursor-pointer items-center gap-3"
              >
                <Checkbox
                  id={specialty}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={() => handleSpecialtyChange(specialty)}
                />

                <span className="text-sm text-gray-600">{specialty}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="border-b border-gray-100 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
            Price Range
          </h3>

            <p className="text-sm font-medium text-primary">${priceRange[0]}</p>
          </div>

        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={maxPrice}
          min={minPrice}
          step={10}
          className="cursor-pointer"
        />

        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={applyFilters}
        className="mt-8 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Apply Filters
      </button>
    </div>
  );
}
