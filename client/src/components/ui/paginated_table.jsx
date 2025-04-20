// components/ui/PaginatedTable.jsx

"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PaginatedTable = ({ data = [], columns = [], rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(columns[0]?.accessor || "");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortField]?.toString().toLowerCase() ?? "";
      const bVal = b[sortField]?.toString().toLowerCase() ?? "";
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [data, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                onClick={() => toggleSort(col.accessor)}
                className="cursor-pointer"
              >
                {col.header}{" "}
                {sortField === col.accessor ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={row.id || row._id || rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.accessor}>
                  {typeof col.cell === "function" ? col.cell(row) : row[col.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default PaginatedTable;
