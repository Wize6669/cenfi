'use client'

import React, {useEffect, useState} from 'react'
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
import {ChevronDown, ChevronLeft, ChevronRight, Search} from 'lucide-react';
import {axiosInstance} from '@/lib/axios';
import {AxiosError} from 'axios';
import {UserTableInterface} from '@/interfaces/User';


interface Pagination {
  currentPage: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  total: number
  pageSize: number
}

const columnHelper = createColumnHelper<UserTableInterface>()

const columns: ColumnDef<UserTableInterface, any>[] = [
  columnHelper.accessor('id', {
    header: '#',
    cell: info => (<div className='flex justify-center'>
      {info.row.index + 1}
    </div>),
  }),
  columnHelper.accessor('name', {
    header: 'NOMBRE',
    cell: info => (<div className='flex justify-center'>
      {info.getValue()}
    </div>),
  }),
  columnHelper.accessor('email', {
    header: 'CORREO',
    cell: info => (<div className='flex justify-center'>
      {info.getValue()}
    </div>),
  }),
  columnHelper.accessor('role', {
    header: 'ROL',
    cell: info => (
      <div className='flex justify-center'>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
        {info.getValue() === 'admin' ? 'Administrador' : 'Profesor'}
      </span>
      </div>
    ),
  }),
  columnHelper.accessor('id', {
    header: 'ACCIONES',
    cell: info => (
      <div className='flex justify-center space-x-6'>
        <div className='relative group'>
          <button className='text-blue-600 hover:text-blue-800'>
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
            className='absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100'>
            Editar
          </span>
        </div>

        <div className='relative group'>
          <button className='text-red-600 hover:text-red-800'>
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
            className='absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-red-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100'>
            Eliminar
          </span>
        </div>
      </div>

    ),
  }),
]

export default function UserTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<UserTableInterface[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: true,
    total:5,
    pageSize: 5
  });
  const [isOpen, setIsOpen] = useState(false);
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
    initialState: {
      pagination: {
        pageSize: pagination.pageSize,
      },
    },
  });

  useEffect(() => {
    axiosInstance
      .get(`/users?page=${pagination.currentPage}&count=${pagination.pageSize}`)
      .then(response => {
        const { data, currentPage, totalPages, hasPreviousPage, hasNextPage, total } = response.data;
        setPagination(prev => ({
          ...prev,
          currentPage,
          totalPages,
          hasPreviousPage,
          hasNextPage,
          total,
        }));
        setData(data);
      })
      .catch(e => console.log(e));
  }, [pagination.currentPage, pagination.pageSize]);

  return (
    <div className='px-6 pb-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Usuarios</h2>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-700'>Filas por página:</span>
          <div className='relative'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center justify-between w-20 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-expanded={isOpen}
            >
              <span>{table.getState().pagination.pageSize}</span>
              <ChevronDown className='w-4 h-4 ml-2' />
            </button>
            {isOpen && (
              <div className='absolute z-10 w-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg'>
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <button
                    key={pageSize}
                    onClick={() => {
                      table.setPageSize(pageSize);
                      setPagination({ ...pagination, pageSize });
                      setIsOpen(false);
                    }}
                    className='block w-full px-4 py-2 text-sm text-left hover:bg-gray-100'
                    aria-label={`Seleccionar ${pageSize} filas`}
                  >
                    {pageSize}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='relative'>
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className='pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Buscar...'
            aria-label='Buscar usuarios'
          />
          <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className='px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer'
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex-1 text-sm text-gray-700'>
          Total {pagination.total} registros
        </div>
        <div className='flex items-center space-x-2'>
          <form className='flex gap-2 items-center'>
            <button
              className='px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50'
              onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
              disabled={pagination.hasPreviousPage}
              aria-label='Página anterior'
            >
              <ChevronLeft size={16}/>
            </button>

            <span>{pagination.currentPage}/{pagination.totalPages}</span>

            <button
              className='px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50'
              onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
              disabled={pagination.hasNextPage}
              aria-label='Página siguiente'
            >
              <ChevronRight size={16}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
