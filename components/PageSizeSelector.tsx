import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface PageSizeSelectorProps<T> {
  table: Table<T>;
  pageSizeOptions?: number[];
  onPageSizeChange?: (newPageSize: number) => void;
}

const PageSizeSelector = <T,>({
                                table,
                                pageSizeOptions = [10, 20, 30, 40, 50],
                                onPageSizeChange
                              }: PageSizeSelectorProps<T>) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Hook personalizado para cerrar el selector al hacer clic fuera
  useOnClickOutside(ref, () => setIsSelectOpen(false));

  const handlePageSizeChange = (newPageSize: number) => {
    table.setPageSize(newPageSize);
    onPageSizeChange?.(newPageSize);
    setIsSelectOpen(false);
  };

  return (
    <div className="flex items-center space-x-2 w-full md:w-auto">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Filas por página:
      </span>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className="flex items-center justify-between w-20 px-3 py-2 text-sm
                     bg-white dark:bg-gray-700 dark:text-gray-300
                     border border-gray-300 dark:border-gray-600 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     transition-colors duration-200"
          aria-label="Seleccionar número de filas por página"
          aria-expanded={isSelectOpen}
          aria-haspopup="listbox"
        >
          {table.getState().pagination.pageSize}
          {isSelectOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isSelectOpen && (
          <div
            className="absolute z-20 w-20 mt-1 bg-white dark:bg-gray-700
                       border border-gray-300 dark:border-gray-600 rounded-md shadow-lg
                       overflow-hidden"
            role="listbox"
            aria-label="Opciones de filas por página"
          >
            {pageSizeOptions.map(pageSize => (
              <div
                key={pageSize}
                role="option"
                aria-selected={table.getState().pagination.pageSize === pageSize}
                className={`
                  px-3 py-2 cursor-pointer text-sm dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-600
                  transition-colors duration-200
                  ${table.getState().pagination.pageSize === pageSize ?
                  'bg-gray-100 dark:bg-gray-600' : ''}
                `}
                onClick={() => handlePageSizeChange(pageSize)}
              >
                {pageSize}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSizeSelector;
