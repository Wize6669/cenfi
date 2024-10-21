'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React from 'react';
import CourseForm from "@/components/(Course module)/CourseForm";
import GoBackButton from "@/components/GoBackButton";

export default function CreateCourse() {

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
              Crear un Nuevo Curso
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <GoBackButton/>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <CourseForm/>
      </div>
      <div className={'flex justify-center'}>
      </div>
      <Footer/>
    </div>
  );
}
