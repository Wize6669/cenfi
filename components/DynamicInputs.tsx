'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from 'axios';
import { Categories, PaginatedResponse } from "@/interfaces/Categories";
import { config } from "@/config";
import { CategoryQuestions } from "@/interfaces/Simulator";

interface DynamicInputsProps {
  inputs: CategoryQuestions[];
  onInputsChange: (inputs: CategoryQuestions[]) => void;
}

const DynamicInputs: React.FC<DynamicInputsProps> = ({ inputs, onInputsChange }) => {
  const [count, setCount] = useState(inputs.length || 1)
  const [openSelect, setOpenSelect] = useState<number | null>(null)
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;
  const inputsRef = useRef(inputs);

  const fetchAllCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      let allCategories: Categories[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axios.get<PaginatedResponse>(`${HOST_BACK_END}/api/v1/categories`, {
          params: {
            page: currentPage,
            count: 500
          }
        });

        allCategories = [...allCategories, ...response.data.data];
        currentPage++;
        totalPages = response.data.totalPages;
      } while (currentPage <= totalPages);

      setCategories(allCategories);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar las categorías');
      setIsLoading(false);
      console.error('Error fetching categories:', err);
    }
  }, [HOST_BACK_END]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    const newInputs = [...inputsRef.current];
    if (count > newInputs.length) {
      for (let i = newInputs.length; i < count; i++) {
        newInputs.push({ categoryId: 0, numberOfQuestions: 0 });
      }
    } else if (count < newInputs.length) {
      newInputs.splice(count);
    }
    if (JSON.stringify(newInputs) !== JSON.stringify(inputsRef.current)) {
      onInputsChange(newInputs);
    }
  }, [count, onInputsChange]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value) || 1
    setCount(newCount)
  }

  const handleSelectChange = (index: number, value: string) => {
    const newInputs = [...inputsRef.current]
    newInputs[index].categoryId = Number(value)
    onInputsChange(newInputs)
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputsRef.current]
    newInputs[index].numberOfQuestions = parseInt(value)
    onInputsChange(newInputs)
  }

  if (isLoading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className={'lg:w-[452px] sm:w-1/2'}>
        <label htmlFor="count" className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300">
          Número de Secciones
        </label>
        <input
          type="number"
          id="count"
          value={count}
          onChange={handleCountChange}
          min="1"
          max="15"
          required={true}
          placeholder="Ingrese el número de secciones"
          className="text-sm sm:text-base md:text-base w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {inputsRef.current.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-10">
          <div className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2 lg:pl-44 sm:pb-2 lg:pb-0 pb-2">
            <label htmlFor={`category-${index}`} className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300">
              Categorías
            </label>
            <div className="relative">
              <select
                id={`category-${index}`}
                value={item.categoryId || ''}
                onChange={(e) => handleSelectChange(index, e.target.value)}
                onFocus={() => setOpenSelect(index)}
                onBlur={() => setOpenSelect(null)}
                required={true}
                className="text-sm sm:text-base md:text-base appearance-none w-full h-[35px] py-1.5 px-1.5 pr-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-200"
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
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
            <label htmlFor={`questions-${index}`} className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300">
              Número de preguntas
            </label>
            <input
              type="number"
              id={`questions-${index}`}
              value={item.numberOfQuestions}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="text-sm sm:text-base md:text-base w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
