import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const headers = ["ID", "Date", "Time", "Dentist", "Service", "Status"];

export function SkeletonTable() {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            key={index}
          >
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-4 border-t border-gray-100 pt-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  {headers.map((header) => (
                    <TableHead
                      className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-400"
                      key={header}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-[80px]">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
      </div>
    </>
  );
}
