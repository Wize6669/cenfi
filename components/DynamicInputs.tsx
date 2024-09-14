'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from "lucide-react";

const DynamicInputs: React.FC = () => {
  const [count, setCount] = useState(1)
  const [inputs, setInputs] = useState<{ select: string; input: string }[]>([{ select: '', input: '' }])
  const [openSelect, setOpenSelect] = useState<number | null>(null)

  useEffect(() => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      if (count > newInputs.length) {
        for (let i = newInputs.length; i < count; i++) {
          newInputs.push({ select: '', input: '' });
        }
      } else if (count < newInputs.length) {
        newInputs.splice(count);
      }
      return newInputs;
    });
  }, [count]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value) || 1
    setCount(newCount)
  }

  const handleSelectChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index].select = value
    setInputs(newInputs)
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index].input = value
    setInputs(newInputs)
  }

  return (
    <div className="space-y-6">
      <div className={'lg:w-[452px] sm:w-1/2'}>
        <label htmlFor="count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Número de Secciones
        </label>
        <input
          type="number"
          id="count"
          value={count}
          onChange={handleCountChange}
          min="1"
          max={'15'}
          required={true}
          placeholder="Ingrese el número de secciones"
          className="w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {inputs.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-10">
          <div className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2 lg:pl-44">
            <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categorías
            </label>
            <div className="relative">
              <select
                id={`category-${index}`}
                value={item.select}
                onChange={(e) => handleSelectChange(index, e.target.value)}
                onFocus={() => setOpenSelect(index)}
                onBlur={() => setOpenSelect(null)}
                required={true}
                className="appearance-none text-sm  w-full h-[35px] py-1.5 px-1.5 pr-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200"
              >
                <option value=" ">Seleccione una categoría</option>
                <option value="opcion1">Razonamiento Matemático</option>
                <option value="opcion2">Rozonamiento Lógico</option>
                <option value="opcion3">Razonamiento Abstracto</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {openSelect === index ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:pr-20">
            <label htmlFor={`questions-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número de preguntas
            </label>
            <input
              type="number"
              id={`questions-${index}`}
              value={item.input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el número de preguntas por categoría"
              required={true}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default DynamicInputs
