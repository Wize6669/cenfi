'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";

export default function Simulator() {
  const router = useRouter();

  const goBack = () => {
    router.push('/admin/menu');
  };

  const handleButtonClickNew = () => {
    router.push('/admin/questions/new');
  };

  const handleButtonClickEdit = () => {
    router.push('/admin/questions/edit');
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
              Lista de Preguntas
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
        </div>
        <div className={'lg:w-[82%] flex justify-end items-center'}>
          <button
            className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
            type={'button'}
            onClick={handleButtonClickNew}
          >
            Nueva Pregunta
          </button>
        </div>
        <div className={'lg:w-[82%] flex justify-end items-center'}>
          <button
            className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
            type={'button'}
            onClick={handleButtonClickEdit}
          >
            Editar Pregunta
          </button>
        </div>

      </div>
      <div className={'flex justify-center'}>
      </div>
      <Footer/>
    </div>
  )
    ;
}
