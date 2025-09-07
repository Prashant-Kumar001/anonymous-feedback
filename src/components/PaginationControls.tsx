"use client";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-2">
      <Button
        disabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        size="sm"
      >
        Prev
      </Button>

      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <Button
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        size="sm"
      >
        Next
      </Button>
    </div>
  );
}
