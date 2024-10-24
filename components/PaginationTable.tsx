import React from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps<T> {
  table: Table<T>;
}

const PaginationTable = <T,>({ table }: PaginationProps<T>) => {
  const {
    getState,
    getPageCount,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
  } = table;

  const { pagination } = getState();
  const pageCount = getPageCount();
  const currentPage = pagination.pageIndex + 1;
  const pageSize = pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const firstItemIndex = Math.max(1, (currentPage - 1) * pageSize + 1);
  const lastItemIndex = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="mt-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Mostrando {firstItemIndex} a {lastItemIndex} de {totalRows} registros
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setPageIndex(0)}
          disabled={!getCanPreviousPage()}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          aria-label="Primera página"
        >
          <ChevronLeft size={16} className="inline" />
          <ChevronLeft size={16} className="inline" />
        </button>

        <button
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
          {currentPage} / {pageCount}
        </span>

        <button
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          aria-label="Siguiente página"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={!getCanNextPage()}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          aria-label="Última página"
        >
          <ChevronRight size={16} className="inline" />
          <ChevronRight size={16} className="inline" />
        </button>
      </div>
    </div>
  );
};

export default PaginationTable;
