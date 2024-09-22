'use client'


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
import {axiosInstance} from '@/lib/axios';
import {UserTableInterface} from '@/interfaces/User';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';
import './UserTable.css'
import Modal from '@/components/Modal/Modal';
import UserForm from "@/components/UserForm";
import {GrFormPrevious} from "react-icons/gr";
import {GrFormNext} from "react-icons/gr";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Pagination} from "@/interfaces/Pagination";
import {ChevronDown, ChevronLeft, ChevronRight, Search} from 'lucide-react'

interface PropsTable {
  handlePageChange: (newPage: number) => void,
  handlePageSizeChange: (newPageSize: number) => void,
  data: UserTableInterface[],
  pagination: Pagination,
}

export default function UserTable({handlePageChange, handlePageSizeChange, data, pagination}: PropsTable) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<UserTableInterface>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userId, setUserId] = useState('');
  const columns: ColumnDef<UserTableInterface, any>[] = [
    columnHelper.accessor('name', {
      id: 'fullName',
      header: 'NOMBRE APELLIDO',
      cell: info => (<div className='flex justify-center'>
        {info.row.original.name} {info.row.original.lastName}
      </div>),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: 'CORREO',
      cell: info => (<div className='flex justify-center'>
        {info.getValue()}
      </div>),
    }),
    columnHelper.accessor('role', {
      id: 'role',
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
            <button className='text-blue-600 hover:text-blue-800' onClick={handleEditBtn(info.row.original.id)}>
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
            <button className='text-red-600 hover:text-red-800' onClick={handleDeleteBtn(info.row.original.id)}>
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
        pageSize: 100,
      },
    },
  });

  const queryClient = useQueryClient();

  const deleteUser = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      if (response.status === 204) {
        toast.success('Usuario eliminado');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error('No se pudo eliminar el usuario');
      } else {
        toast.error('Hubo un error inesperado');
      }
    }
  }

  const {mutateAsync: deleteUserMutation} = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['users']});
    }
  });

  const handleDeleteBtn = (id: string) => async (event: MouseEvent<HTMLButtonElement>) => {
    await deleteUserMutation(id)
  };

  const handleEditBtn = (id: string) => async (event: MouseEvent<HTMLButtonElement>) => {
    setUserId(id);
    setIsOpenModal(prevState => !prevState);
  }

  if (data.length === 0) {
    return (
      <div className='px-6 pb-6 bg-white rounded-lg shadow-lg'>
        <div>No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pt-2">Usuarios</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Filas por página:</span>
          <div className="relative">
            <select
              className={'flex items-center justify-between w-20 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
              value={table.getState().pagination.pageSize}
              onChange={e => {
                handlePageSizeChange(Number(e.target.value))
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative">
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
            placeholder="Buscar..."
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table id={'user-table'} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-6 py-3 text-center text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
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
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
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
        <div className='flex gap-5 mr-5'>
          <button onClick={() => handlePageChange(1)}
                  className="border-zinc-500 rounded-md border-2 px-5 relative group">
            1
            <span
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
                Primera página
            </span>
          </button>
          <button onClick={() => handlePageChange(pagination.previousPage ?? 1)}
                  className={`border-zinc-500 rounded-md border-2 px-5 ${!pagination.hasPreviousPage ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!pagination.hasPreviousPage}><GrFormPrevious/>
            <span
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
                Anterior página
            </span>
          </button>
          <span
            className={'border-zinc-500 rounded-md border-2 px-5'}>{pagination.currentPage} / {pagination.totalPages}
          </span>
          <button onClick={() => handlePageChange(pagination.nextPage ?? pagination.totalPages)}
                  className={`border-zinc-500 rounded-md border-2 px-5 ${!pagination.hasNextPage ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!pagination.hasNextPage}><GrFormNext/>
            <span
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
                Siguiente página
            </span>
          </button>

          <button onClick={() => handlePageChange(pagination.totalPages)}
                  className="border-zinc-500 rounded-md border-2 px-5 relative group">
            {pagination.totalPages}
            <span
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
                Ultima página
            </span>
          </button>
        </div>
      </div>

      <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <UserForm id={userId}/>
      </Modal>
    </div>
  )
}
