import React, {MouseEvent, useState} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import './SimulatorTable.css'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/interfaces/Pagination";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useRouter } from 'next/navigation';

interface Simulator {
  id: string;
  name: string;
  password: string;
  duration: number;
  visibility: boolean;
  navigate: boolean;
  review: boolean;
  number_of_questions: number;
}

interface PropsTable {
  handlePageChange: (newPage: number) => void,
  handlePageSizeChange: (newPageSize: number) => void,
  data: Simulator[],
  pagination: Pagination,
}

export default function SimulatorTable({ handlePageChange, handlePageSizeChange, data, pagination }: PropsTable) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Simulator>();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [simulatorToDelete, setSimulatorToDelete] = useState<string | null>(null);
  const router = useRouter();

  const columns: ColumnDef<Simulator, any>[] = [
    columnHelper.accessor('name', {
      header: 'SIMULADOR',
      cell: info => (
        <div className='text-center truncate max-w-[200px]' title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor('duration', {
      header: 'DURACIÓN',
      cell: info => (
        <div className='text-center'>
          {info.getValue()} minutos
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('visibility', {
      header: 'VISIBILIDAD',
      cell: info => (
        <div className='flex justify-center'>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue() ? 'Visible' : 'No visible'}
          </span>
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('navigate', {
      header: 'NAVEGACIÓN',
      cell: info => (
        <div className='flex justify-center'>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue() ? 'Permitida' : 'No permitida'}
          </span>
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('review', {
      header: 'REVISIÓN',
      cell: info => (
        <div className='flex justify-center'>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue() ? 'Permitida' : 'No permitida'}
          </span>
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('number_of_questions', {
      header: 'PREGUNTAS',
      cell: info => (
        <div className='text-center'>
          {info.getValue()}
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor('id', {
      header: 'ACCIONES',
      cell:
        info => (
          <div className='flex justify-center space-x-6'>
            <div className='relative group'>
              <button
                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
                onClick={handleEditSimulator(info.row.original.id)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                  />
                </svg>
              </button>
              <span
                className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100'>
              Editar
            </span>
            </div>

            <div className='relative group'>
              <button
                className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                onClick={handleDeleteSimulator(info.row.original.id)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  />
                </svg>
              </button>
              <span
                className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 transition-all duration-300 bg-red-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100'>
              Eliminar
            </span>
            </div>
          </div>
        ),
      size: 100,
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  const queryClient = useQueryClient();

  const deleteSimulator = async (id: string) => {
    const response = await axiosInstance.delete(`/simulators/${id}`);
    if (response.status === 204) {
      toast.success('Simulador eliminado');
    }
    return response.data;
  }

  const { mutateAsync: deleteSimulatorMutation } = useMutation({
    mutationFn: deleteSimulator,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['simulators'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('No se pudo eliminar el simulador');
      } else {
        toast.error('Hubo un error inesperado');
      }
    }
  });

  const handleDeleteSimulator = (id: string) => async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSimulatorToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (simulatorToDelete) {
      try {
        await deleteSimulatorMutation(simulatorToDelete);
      } catch (error) {
        console.error('Error al eliminar el simulador:', error);
      }
    }
    setIsConfirmOpen(false);
  };

  const handleEditSimulator = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    router.push(`/admin/simulators/edit/${id}`);
  }

  return (
    <div className="border_table px-6 pb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pt-2">Simuladores Disponibles</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-sm text-gray-700 dark:text-gray-300">Filas por página:</span>
          <div className="relative">
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="flex items-center justify-between w-20 px-3 py-2 dark:text-gray-300 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {table.getState().pagination.pageSize}
              {isSelectOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {isSelectOpen && (
              <div className="absolute z-20 w-20 mt-1 bg-white dark:text-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <div
                    key={pageSize}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      handlePageSizeChange(pageSize);
                      table.setPageSize(pageSize);
                      setIsSelectOpen(false);
                    }}
                  >
                    {pageSize}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full md:w-64 pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
            placeholder="Buscar..."
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
        </div>
      </div>
      <div className='max-h-[450px] overflow-x-auto'>
        <table id={'simulator-table'} className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-700 sticky top-0 z-10'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className='px-6 py-3 text-center text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider cursor-pointer'
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className='mt-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
        <div className='text-sm text-gray-700 dark:text-gray-300'>
          Mostrando {Math.max(1, (pagination.currentPage - 1) * pagination.pageSize + 1)} a {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} de {pagination.total} registros
        </div>
        <div className='flex flex-wrap justify-center gap-2'>
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <ChevronLeft size={16} className="inline"/>
            <ChevronLeft size={16} className="inline"/>
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <ChevronLeft size={16}/>
          </button>
          <span className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1  text-sm text-gray-700 dark:text-gray-300'>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <ChevronRight size={16}/>
          </button>
          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <ChevronRight size={16} className="inline"/>
            <ChevronRight size={16} className="inline"/>
          </button>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25"/>
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    Confirmar eliminación
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ¿Estás seguro de que deseas eliminar este simulador? Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={confirmDelete}
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}