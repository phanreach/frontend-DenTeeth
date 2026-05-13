import React from "react";
import Icon from "../assets/icons/icon-asset";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobile?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isMobile = false,
}) => {
  const handleClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (totalPages <= 1) return null;

  const getPages = (current: number, total: number) => {
    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    // First 3
    if (isMobile) {
      pages.push(1, 2);
    } else {
      pages.push(1, 2, 3);
    }

    // Left dots
    if (current > 5) {
      pages.push("...");
    }

    // Middle pages
    const start = Math.max(4, current - 1);
    const end = Math.min(total - 3, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right dots
    if (current < total - 4) {
      pages.push("...");
    }

    // Last 3
    if (isMobile) {
      pages.push(total - 1, total);
    } else {
      pages.push(total - 2, total - 1, total);
    }

    return [...new Set(pages)];
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
      >
        <Icon name="previous" />
      </button>

      <div className="flex gap-2">
        {/* {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === index + 1
                ? "bg-jci-primary-dark text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))} */}
        {getPages(currentPage, totalPages).map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handleClick(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
      >
        <Icon name="next" />
      </button>
    </div>
  );
};

export default Pagination;
