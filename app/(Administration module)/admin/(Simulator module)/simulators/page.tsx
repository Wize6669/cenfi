'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, {useState} from 'react';
import SimulatorTable from "@/components/SimulatorTable/SimulatorTable";
import GoBackButton from "@/components/GoBackButton";
import { usePagination } from '@/hooks/usePaginationQuery';
import { SimulatorListTable } from '@/interfaces/Simulator';
import LoadingDialog from "@/components/LoadingDialog";

export default function Simulator() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: simulators,
    isLoading: isPaginationLoading,
    handleCreateNew: handleButtonClickCreate,
    handlePageSizeChange
  } = usePagination<SimulatorListTable>({
    baseUrl: '/simulators',
    initialPageSize: 10,
    queryKey: 'simulators',
  });

  const handleNewQuestionClick = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
      handleButtonClickCreate();
    }, 3000);
  };

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
              Lista de Simuladores
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
            Nuevo Simulador
          </button>
        </div>
      </div>
      <div className={'flex-grow flex justify-center'}>
          {isPaginationLoading ? (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Cargando simuladores...</p>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-5/6 lg:w-2/3 scale-90">
              <SimulatorTable
                handlePageSizeChange={handlePageSizeChange}
                data={simulators}
              />
            </div>
          )}
      </div>
      <Footer/>
      <LoadingDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cargando formulario"
        message="Preparando el formulario para crear un nuevo simulador..."
      />
    </div>
  );
}
