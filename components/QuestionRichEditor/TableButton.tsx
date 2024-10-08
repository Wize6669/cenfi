import React, { useState } from 'react';
import { TbFreezeRowColumn, TbTableColumn } from 'react-icons/tb';
import { LayoutGrid, Merge, Split, Table, Trash2 } from 'lucide-react';
import { EditorProps } from '@/interfaces/Questions'

export default function TableButton ({ editor }:EditorProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false)

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
      setIsTableMenuOpen(false)
    }
  }

  const tableControls = [
    { icon: <TbTableColumn className={'w-5 h-5 lg:w-6 lg:h-6'}/>, action: () => editor?.chain().focus().addColumnAfter().run(), title: 'Añadir columna después' },
    { icon: <TbFreezeRowColumn className={'w-5 h-5 lg:w-6 lg:h-6'}/>, action: () => editor?.chain().focus().addRowAfter().run(), title: 'Añadir fila después' },
    { icon: <Trash2 className={'w-5 h-5 lg:w-6 lg:h-6'}/>, action: () => editor?.chain().focus().deleteTable().run(), title: 'Eliminar tabla' },
    { icon: <Merge className={'w-5 h-5 lg:w-6 lg:h-6'}/>, action: () => editor?.chain().focus().mergeCells().run(), title: 'Combinar celdas' },
    { icon: <Split className={'w-5 h-5 lg:w-6 lg:h-6'} />, action: () => editor?.chain().focus().splitCell().run(), title: 'Dividir celda' },
    { icon: <LayoutGrid className={'w-5 h-5 lg:w-6 lg:h-6'}/>, action: () => editor?.chain().focus().toggleHeaderRow().run(), title: 'Alternar fila de encabezado' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
        className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Insertar tabla"
      >
        <Table className={`w-4 h-4 sm:w-5 sm:h-5 ${isTableMenuOpen ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
      </button>
      {isTableMenuOpen  && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-4 w-40 lg:w-48 lg:left-0 lg:-translate-x-0 left-1/2 transform -translate-x-1/2">
          <div className="mb-2 lg:mb-4">
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filas:
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="mt-1 px-2 border dark:border-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
          <div className="mb-3 lg:mb-4">
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Columnas:
              <input
                type="number"
                min="1"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="mt-1 px-2 border dark:border-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
          <button
            onClick={insertTable}
            className="w-full text-xs lg:text-sm bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            type={'button'}
          >
            Insertar Tabla
          </button>
          <div className="mt-3 lg:mt-4 grid grid-cols-3 gap-2">
            {tableControls.map((control, index) => (
              <button
                key={index}
                onClick={control.action}
                className="p-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title={control.title}
                type={'button'}
              >
                <span className="flex justify-center">{control.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
