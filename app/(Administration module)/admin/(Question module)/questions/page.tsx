'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModuleListNavbar from '@/components/ModulesList/ModuleListNavbar';
import React, { useEffect, useState } from 'react';
import QuestionTable from '@/components/QuestionTable/QuestionTable';
import GoBackButton from '@/components/GoBackButton';
import { usePagination } from "@/hooks/usePaginationQuery";
import { QuestionTableInterface } from "@/interfaces/Questions";
import LoadingDialog from '@/components/LoadingDialog';

export default function Question() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: questions,
    pagination,
    isLoading,
    handleCreateNew: handleButtonClickCreate,
    handlePageChange,
    handlePageSizeChange
  } = usePagination<QuestionTableInterface>({
    baseUrl: '/questions',
    initialPageSize: 10,
    queryKey: 'questions',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleNewQuestionClick = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
      handleButtonClickCreate();
    }, 2000);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className='flex-grow flex flex-col items-center place-items-center px-4'>
        <div className='w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'>
          <div className='w-auto col-span-2'>
            <h1 className='font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'>
              Lista de Preguntas
            </h1>
          </div>
          <div className='row-start-2 justify-items-center content-center'>
            <GoBackButton/>
          </div>
          <div className='w-full row-start-2 content-center justify-items-center'>
            <div className='border-t-2 container dark:border-gray-600'/>
          </div>
        </div>
        <div className='lg:w-[82%] flex justify-end items-center'>
          <button
            className='text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'
            type='button'
            onClick={handleNewQuestionClick}
          >
            Nueva Pregunta
          </button>
        </div>
      </div>
      <div className='flex justify-center'>
      </div>
      <div className='flex-grow flex justify-center'>
        {isLoading ? (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Cargando preguntas...</p>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-5/6 lg:w-2/3 scale-90">
            <QuestionTable
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
              data={questions}
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
        message="Preparando el formulario para crear una nueva pregunta..."
      />
    </div>
  );
}
