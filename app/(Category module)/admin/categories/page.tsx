'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import { useRouter } from 'next/navigation';
import {IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import React from "react";


export default function Categories() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col justify-stretch items-center'}>
        <div className="w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center">
          <div className="w-auto col-span-2">
            <h1 className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>Administración de
              Categorías</h1>
          </div>
          <div className="row-start-2 justify-items-center content-center">
            <IconButton sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className="text-gray-400 dark:text-gray-300"/>
            </IconButton>
          </div>
          <div className="w-full row-start-2 content-center justify-items-center">
            <div className="border-t-2 container dark:border-gray-600"/>
          </div>
        </div>
        <form className={"grid gap-x-10 gap-y-5 lg:w-3/12 md:w-4/5 mt-2"}>
          <div className={'gap-x-0'}>
            <div className="content-end">
              <label
                className={'text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor="fullName"
              >
                Categoría
              </label>
            </div>
            <div>
              <input
                className={'peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                  '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type="text"
                name="fullName"
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
              className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200'}
              type={'submit'}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <div className="w-2/3 scale-90">
        </div>
      </div>
      <Footer/>
    </div>
  );
}
