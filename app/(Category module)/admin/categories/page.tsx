'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import { useRouter } from 'next/navigation';
import {IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";


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
        <h1 className={'font-bold text-3xl mt-4 text-gray-900 dark:text-gray-200'}>Administración de Categorías</h1>
        <div className={'flex justify-between items-center container w-full'}>
          <div className={'pr-8'}>
            <IconButton sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className="text-gray-400 dark:text-gray-300"/>
            </IconButton>
          </div>
          <div className="border-t-2 container w-full dark:border-gray-600"/>
        </div>
        <form className={"grid grid-rows-1 grid-flow-col pt-8"}>
          <div className={'flex flex-col mb-3'}>
            <label
              className={'text-base font-medium text-gray-900 dark:text-gray-300'}
              htmlFor={'fullName'}>Categoría
            </label>
            <input
              className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-800 dark:text-gray-200 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'}
              type={'text'}
              name={'fullName'}
              placeholder={'Ingresa el nombre de la nueva categoría'}
              required={true}
              style={{width: '450px', height: '35px'}}
            />
          </div>
        </form>
        <button
          className={'bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-6 mt-4 rounded-full transition-colors ease-in-out duration-200'}>
          Registrar
        </button>
      </div>
      <div className="flex justify-center">
        <div className="w-2/3 scale-90">
        </div>
      </div>
      <Footer/>
    </div>
  );
}
