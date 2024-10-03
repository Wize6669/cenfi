'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CategoryNewUpdate } from "@/interfaces/Categories";
import { Pagination } from "@/interfaces/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/interfaces/ResponseAPI";
import CategoryTable from "@/components/CategoryTable/CategoryTable";

export default function Categories() {
  const [category, setCategories] = useState<CategoryNewUpdate>({
    name: '',
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: true,
    previousPage: 0,
    nextPage: 0,
    total: 0,
    pageSize: 10
  })
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryFn: () => fetchCategory(),
    queryKey: ['categories', pagination.currentPage, pagination.pageSize],
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      const urlParams = new URLSearchParams({ page: newPage.toString(), count: pagination.pageSize.toString() });
      router.push(`/admin/categories?${urlParams.toString()}`);
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
    const urlParams = new URLSearchParams({ page: pagination.currentPage.toString(), count: newPageSize.toString() });
    router.push(`/admin/categories?${urlParams.toString()}`);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await addCategoryMutation()
  }

  const fetchCategory = async () => {
    const response = await axiosInstance.get(`/categories?page=${pagination.currentPage}&count=${pagination.pageSize}`);
    const {
      data,
      currentPage,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      total
    } = response.data;
    setPagination(prev => ({
      ...prev,
      currentPage,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      total,
    }));

    return data;
  }

  const addCategories = async () => {
    try {
      await axiosInstance.post('/categories/', { name: category.name });
      toast.success("Categoría creada con éxito!");
      resetForm()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
          const errors = error?.response?.data.errors;
          const errorApi = error?.response?.data.error;

          if (Array.isArray(errors)) {
            const errorsMessages = errors
              .map((errorMessage: ErrorResponse) => errorMessage?.message)
              .join('\n');

            return toast.error(errorsMessages);
          }

          return toast.error(errorApi.message);
        }

        if (error?.response?.status === 409) {
          return toast.error('La categoría ya existe');
        }
      }
      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  const goBack = () => {
    router.push('/admin/menu');
  };

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
            <IconButton className={'dark:border-gray-500 dark:hover:bg-gray-600'} sx={{ border: '1px solid #ccc' }} onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-500'} />
            </IconButton>
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
        <div className="w-full md:w-5/6 lg:w-2/3 scale-90">
          {!isLoading && <CategoryTable handlePageChange={handlePageChange}
                                    handlePageSizeChange={handlePageSizeChange}
                                    data={categories}
                                    pagination={pagination}/>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
