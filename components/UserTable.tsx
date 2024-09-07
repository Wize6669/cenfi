'use client'

import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

type User = {
  id: string
  nombre: string
  correo: string
  rol: string
}

const data: User[] = [
  { id: '#1', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#2', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#3', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#4', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#5', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
  { id: '#6', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#7', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#8', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#9', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#10', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
  { id: '#11', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#12', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#13', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#14', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#15', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
  { id: '#16', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#17', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#18', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#19', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#20', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
  { id: '#21', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#22', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#23', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#24', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#25', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
  { id: '#26', nombre: 'Christian', correo: 'christian@cenfi.com', rol: 'Administrador' },
  { id: '#27', nombre: 'Profesor 1', correo: 'profesor1@cenfi.com', rol: 'Profesor' },
  { id: '#28', nombre: 'Profesor 2', correo: 'profesor2@cenfi.com', rol: 'Profesor' },
  { id: '#29', nombre: 'Profesor 3', correo: 'profesor3@cenfi.com', rol: 'Profesor' },
  { id: '#30', nombre: 'Profesor 4', correo: 'profesor4@cenfi.com', rol: 'Profesor' },
]



const columnHelper = createColumnHelper<User>()

const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => (<div className="flex justify-center">
      {info.getValue()}
    </div>),
  }),
  columnHelper.accessor('nombre', {
    header: 'NOMBRE',
    cell: info => (<div className="flex justify-center">
      {info.getValue()}
    </div>),
  }),
  columnHelper.accessor('correo', {
    header: 'CORREO',
    cell: info => (<div className="flex justify-center">
      {info.getValue()}
    </div>),
  }),
  columnHelper.accessor('rol', {
    header: 'ROL',
    cell: info => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'Administrador' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
        {info.getValue()}
      </span>
      </div>
    ),
  }),
  columnHelper.accessor('id', {
    header: 'ACCIONES',
    cell: info => (
      <div className="flex justify-center space-x-6">
        <div className="relative group">
          <button className="text-blue-600 hover:text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-blue-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
            Editar
          </span>
        </div>

        <div className="relative group">
          <button className="text-red-600 hover:text-red-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 transition-all duration-300 bg-red-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100">
            Eliminar
          </span>
        </div>
      </div>

    ),
  }),
]

export default function UserTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [gotoPage, setGotoPage] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        pageSize: 5,
      },
    },
  })

  const handleGotoPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const page = parseInt(gotoPage)
    if (page > 0 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1)
    }
    setGotoPage('')
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="px-6 pb-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Usuarios</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Filas por página:</span>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-20 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{table.getState().pagination.pageSize}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isOpen && (
              <div className="absolute z-10 w-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <button
                    key={pageSize}
                    onClick={() => {
                      table.setPageSize(pageSize)
                      setIsOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    {pageSize}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar..."
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer"
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
          <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 text-sm text-gray-700">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </button>
          {table.getPageCount() > 3 ? (
            <>
              <button
                className={`px-3 py-1 border ${table.getState().pagination.pageIndex === 0
                  ? 'bg-button-color text-white'
                  : 'border-gray-300 text-gray-700'
                } rounded-md text-sm`}
                onClick={() => table.setPageIndex(0)}
              >
                1
              </button>
              <form onSubmit={handleGotoPage} className="inline-flex items-center">
                <input
                  type="number"
                  min={1}
                  max={table.getPageCount()}
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                />
                <button
                  type="submit"
                  className="ml-1 px-2 py-1 bg-button-color text-white rounded-md text-sm"
                >
                  Ir
                </button>
              </form>
              <button
                className={`px-3 py-1 border ${table.getState().pagination.pageIndex === table.getPageCount() - 1
                  ? 'bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-700'
                } rounded-md text-sm`}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              >
                {table.getPageCount()}
              </button>
            </>
          ) : (
            Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border ${table.getState().pagination.pageIndex + 1 === page
                  ? 'bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-700'
                } rounded-md text-sm`}
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </button>
            ))
          )}
          <button
            className="px-2 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
