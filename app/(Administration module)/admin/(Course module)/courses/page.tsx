'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import CourseTable from "@/components/CourseTable/CourseTable";
import {useAuthStore} from "@/store/auth";
import GoBackButton from "@/components/GoBackButton";
import { usePagination } from "@/hooks/usePaginationQuery";
import {CourseTableInteface} from "@/interfaces/Course";
import LoadingDialog from "@/components/LoadingDialog";

export default function Course() {

  const router = useRouter();

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userAuth = useAuthStore((state) => state.userAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: courses,
    pagination,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
    handleCreateNew: handleButtonClickNew,
  } = usePagination<CourseTableInteface>({
    baseUrl: '/courses',
    initialPageSize: 10,
    queryKey: 'courses'
  });

  const handleNewQuestionClick = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
      handleButtonClickNew();
    }, 2000);
  };

  useEffect(() => {
    if (userAuth?.roleId !== 1 || !isLoggedIn) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userAuth, router, isLoggedIn]);


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
              Lista de Cursos
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <GoBackButton/>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <div className={'lg:w-[82%] flex justify-end items-center'}>
          <button
            className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
            type={'button'}
            onClick={handleNewQuestionClick}
          >
            Nuevo Curso
          </button>
        </div>
      </div>
      <div className={'flex-grow flex justify-center'}>
        {isLoading ? (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Cargando cursos...</p>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-5/6 lg:w-2/3 scale-90">
            <CourseTable
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
              data={courses}
              pagination={pagination}
            />
          </div>
        )}
      </div>
      <Footer/>
      <LoadingDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cargando formulario"
        message="Preparando el formulario para crear un nuevo curso..."
      />
    </div>
  );
}
