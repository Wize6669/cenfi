'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Categories, PaginatedResponse } from '@/interfaces/Categories';
import { axiosInstance } from '@/lib/axios';

interface CategoryQuestion {
  categoryId: number;
  numberOfQuestions: number;
}

interface DynamicInputsProps {
  inputs: CategoryQuestion[];
  onInputsChange: (inputs: CategoryQuestion[]) => void;
}

const DynamicInputs: React.FC<DynamicInputsProps> = ({ inputs, onInputsChange }) => {
  const [count, setCount] = useState(inputs.length || 1)
  const [openSelect, setOpenSelect] = useState<number | null>(null)
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryQuestionCounts, setCategoryQuestionCounts] = useState<{[key: number]: number}>({});
  const [localInputs, setLocalInputs] = useState<CategoryQuestion[]>(inputs)

  const fetchAllCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      let allCategories: Categories[] = [];
      let questionCounts: {[key: number]: number} = {};
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axiosInstance.get<PaginatedResponse>(`categories`, {
          params: {
            page: currentPage,
            count: 500
          }
        });

        allCategories = [...allCategories, ...response.data.data];
        response.data.data.forEach(category => {
          questionCounts[category.id] = category.questionCount || 0;
        });
        currentPage++;
        totalPages = response.data.totalPages;
      } while (currentPage <= totalPages);

      setCategories(allCategories);
      setCategoryQuestionCounts(questionCounts);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar las categorías');
      setIsLoading(false);
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories()
      .then(() => {
        console.log('Categorías cargadas correctamente.');
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [fetchAllCategories]);


  useEffect(() => {
    const newInputs = Array(count).fill(null).map((_, index) =>
      localInputs[index] || { categoryId: 0, numberOfQuestions: 0 }
    );
    setLocalInputs(newInputs);
    onInputsChange(newInputs);
  }, [count]);

  useEffect(() => {
    setLocalInputs(inputs);
    setCount(inputs.length || 1);
  }, [inputs]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value) || 1
    setCount(newCount)
  }

  const handleSelectChange = (index: number, value: string) => {
    const newInputs = [...localInputs]
    newInputs[index].categoryId = value === "" ? 0 : parseInt(value)
    setLocalInputs(newInputs)
    onInputsChange(newInputs)
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...localInputs]
    newInputs[index].numberOfQuestions = parseInt(value) || 0
    setLocalInputs(newInputs)
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
      {localInputs.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-10">
          <div className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2 lg:pl-44 sm:pb-2 lg:pb-0 pb-2">
            <label htmlFor={`category-${index}`} className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300">
              Categorías
            </label>
            <div className="flex items-center space-x-3">
              {item.categoryId !== 0 && categoryQuestionCounts[item.categoryId] !== undefined && (
                <span className="text-sm px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {categoryQuestionCounts[item.categoryId]}
                </span>
              )}
              <div className="relative flex-grow w-full">
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
          </div>
          <div className="w-full sm:w-1/2 lg:pr-20">
            <label htmlFor={`questions-${index}`} className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300">
              Número de preguntas
            </label>
            <input
              type="number"
              id={`questions-${index}`}
              value={item.numberOfQuestions || ''}
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
