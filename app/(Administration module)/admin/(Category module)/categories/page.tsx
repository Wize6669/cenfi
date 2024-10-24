'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { CategoryNewUpdate, CategoryTableInterface } from "@/interfaces/Categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import CategoryTable from "@/components/CategoryTable/CategoryTable";
import GoBackButton from "@/components/GoBackButton";
import { handleAxiosError } from "@/utils/errorHandler";
import { usePagination } from "@/hooks/usePaginationQuery";

export default function Categories() {
  const [category, setCategories] = useState<CategoryNewUpdate>({
    name: '',
  });

  const {
    data: categories,
    pagination,
    isLoading,
    handlePageChange,
    handlePageSizeChange
  } = usePagination<CategoryTableInterface>({
    baseUrl: '/categories',
    initialPageSize: 10,
    queryKey: 'categories'
  });

  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCategories({
      ...category,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }

    setCategories({
      name: ''
    });
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await addCategoryMutation()
  }


  const addCategories = async () => {
    try {
      await axiosInstance.post('/categories/', { name: category.name });
      toast.success("Categoría creada con éxito!");
      resetForm()
    } catch (error) {
      handleAxiosError(error, {
          conflict: 'La categoría ya existe',
          default: 'Error en la solicitud',
          badRequest: 'Ocurrió un error inesperado, inténtelo nuevamente más tarde'
      });

      if (formRef.current) {
        formRef.current.reset();
      }

      setCategories({
        name: ''
      });
    }
  }

  const { mutateAsync: addCategoryMutation } = useMutation({
    mutationFn: addCategories,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  });

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar />
      </Header>
      <div className={'flex-grow flex flex-col justify-stretch items-center px-4'}>
        <div className="w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center">
          <div className="w-auto col-span-2">
            <h1 className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>Administración de
              Categorías</h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <GoBackButton/>
          </div>
          <div className="w-full row-start-2 content-center justify-items-center">
            <div className="border-t-2 container dark:border-gray-600" />
          </div>
        </div>
        <form className={"container grid gap-x-10 gap-y-5 lg:w-3/12 md:w-4/5 mt-2 sm:px-6 lg:px-0 px-6"}
              ref={formRef}
              onSubmit={handleSubmit}
        >
          <div className={'gap-x-0'}>
            <div className="content-end">
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'name'}
              >
                Categoría
              </label>
            </div>
            <div>
              <input
                className={'text-sm sm:text-base md:text-base peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type={'text'}
                name={'name'}
                onChange={handleGetDataInput}
                placeholder="Ingresa el nombre de la nueva categoría"
                required={true}
                minLength={3}
              />
              <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
                El nombre de la categoría debe contener mínimo 3 caracteres.
              </p>
            </div>
          </div>
          <div className={'col-span-full flex justify-center items-center'}>
            <button
              className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200'}
              type={'submit'}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
      <div className="flex-grow flex justify-center">
          {isLoading ? (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Cargando categorías...</p>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-5/6 lg:w-2/3 scale-90">
              <CategoryTable
                handlePageChange={handlePageChange}
                handlePageSizeChange={handlePageSizeChange}
                data={categories}
                pagination={pagination}
              />
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
}
