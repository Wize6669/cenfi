'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import CourseTable from "@/components/CourseTable/CourseTable";
import {Pagination} from "@/interfaces/Pagination";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/lib/axios";
import {useAuthStore} from "@/store/auth";

export default function Course() {

  const router = useRouter();

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userAuth = useAuthStore((state) => state.userAuth);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: true,
    previousPage: 0,
    nextPage: 0,
    total: 0,
    pageSize: 10
  });

  useEffect(() => {
    if (userAuth?.roleId !== 1 || !isLoggedIn) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userAuth, router, isLoggedIn]);

  const {data: courses, isLoading} = useQuery({
    queryFn: () => fetchCourse(),
    queryKey: ['courses', pagination.currentPage, pagination.pageSize],
  });

  const fetchCourse = async () => {
    const response = await axiosInstance.get(`/course?page=${pagination.currentPage}&count=${pagination.pageSize}`);
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
  const goBack = () => {
    router.push('/admin/menu');
  };

  const handleButtonClickNew = () => {
    router.push('/admin/course/new');
  };

  const handleButtonClickEdit = () => {
    router.push('/admin/course/edit');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({...prev, currentPage: newPage}));
      const urlParams = new URLSearchParams({page: newPage.toString(), count: pagination.pageSize.toString()}); // Update both page and count params
      router.push(`/admin/users?${urlParams.toString()}`);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({...prev, pageSize: newPageSize}));
    const urlParams = new URLSearchParams({page: pagination.currentPage.toString(), count: newPageSize.toString()}); // Update both page and count params
    router.push(`/admin/users?${urlParams.toString()}`);
  };

  if (showLoginMessage) {
    return (
      <div className={'flex flex-col min-h-screen'}>
        <div className={'flex-grow flex flex-col justify-center items-center'}>
          <div className={'justify-center gap-2 border-2 rounded-md w-[330px] h-[100px] px-2.5 py-1.5'}>
            <p className={'text-center font-bold text-3xl mb-3'}>⚠️ Inicia sesión ⚠️</p>
            <p className={'text-base'}>Redirigiendo a la página de Log In <b>...</b></p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1
              className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>
              Banco de Preguntas
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <IconButton className={'dark:border-gray-500 dark:hover:bg-gray-600'} sx={{border: '1px solid #ccc'}}
                        onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-500'}/>
            </IconButton>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
          <div className={'col-span-full flex flex-grow justify-center items-center'}>
            <button
              className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
              type={'button'}
              onClick={handleButtonClickNew}
            >
              Nuevo Curso
            </button>
            <button
              className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
              type={'button'}
              onClick={handleButtonClickEdit}
            >
              Editar Curso
            </button>
          </div>
        </div>
      </div>
      <div className={'flex-grow flex justify-center'}>
        <div className={'w-2/3 scale-90'}>
          {!isLoading && <CourseTable handlePageChange={handlePageChange}
                                      handlePageSizeChange={handlePageSizeChange}
                                      data={courses} pagination={pagination}/>}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
