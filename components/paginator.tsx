"use client";

import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import type { PaginationOptions } from "@/utils/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export type PaginatorProps = PaginationOptions & {
  total: number;
};

export const Paginator = ({ total, page, pageSize }: PaginatorProps) => {
  const searchParams = useSearchParams();

  const getNextSearchParams = (newPage: number) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("page", newPage.toString());
    return `?${nextSearchParams.toString()}` as Route;
  };

  if (total <= 0 || pageSize <= 0 || total <= pageSize) {
    return null;
  }

  const pageTotal = Math.ceil(total / pageSize);

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getNextSearchParams(page - 1)} />
          </PaginationItem>
        )}
        {page > 2 && (
          <PaginationItem>
            <PaginationLink href={getNextSearchParams(1)}>{1}</PaginationLink>
          </PaginationItem>
        )}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink href={getNextSearchParams(page - 1)}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {page < pageTotal && (
          <PaginationItem>
            <PaginationLink href={getNextSearchParams(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < pageTotal - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page < pageTotal - 1 && (
          <PaginationItem>
            <PaginationLink href={getNextSearchParams(pageTotal)}>
              {pageTotal}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < pageTotal && (
          <PaginationItem>
            <PaginationNext href={getNextSearchParams(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
