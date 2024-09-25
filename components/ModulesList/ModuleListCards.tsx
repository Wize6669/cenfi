'use client'

import { FaUser } from 'react-icons/fa';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { MdOutlineCategory } from 'react-icons/md';
import { IoIosSettings } from 'react-icons/io';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import React from "react";

export default function ModuleListCards() {
  const userAuth = useAuthStore((state) => state.userAuth);
  const router = useRouter();

  const handleUserModule = () => {
    router.push('/admin/users');
  }

  const handleCategoryModule = () => {
    router.push('/admin/categories');
  }

  const handleSimulatorModule = () => {
    router.push('/admin/simulator');
  }

  const handleQuestionsModule = () => {
    router.push('/admin/questions');
  }

  const modules = [
    userAuth?.roleId === 1 ? {
      icon: <FaUser size={65} />,
      title: "Gestión de Usuarios",
      onClick: handleUserModule
    } : null,
    {
      icon: <FaRegCircleQuestion size={65} />,
      title: "Gestión de Preguntas",
      onClick: handleQuestionsModule
    },
    {
      icon: <MdOutlineCategory size={65} />,
      title: "Gestión de Categorías",
      onClick: handleCategoryModule
    },
    {
      icon: <IoIosSettings size={70} />,
      title: "Configuración del Simulador",
      onClick: handleSimulatorModule
    }
  ].filter(Boolean);

  return (
    <div className={'dark:bg-gray-900 p-4'}>
      <div className={'my-5'}>
        <h1 className={'text-center text-2xl lg:text-3xl font-bold mb-2.5 dark:text-gray-200'}>Módulos del Sistema</h1>
        <hr className="border-gray-300 dark:border-gray-700" />
      </div>

      <div className={'flex justify-center'}>
        <div className={`grid gap-6 ${
          modules.length === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        } justify-items-center`}>
          {modules.map((module, index) => (
            module && (
              <div
                key={index}
                className={`flex flex-col gap-y-5 justify-center items-center bg-[#F1F9FB] dark:bg-gray-700 rounded-md w-[200px] h-[175px] cursor-pointer shadow-lg dark:shadow-blue-400 transition-transform hover:scale-105 ${
                  modules.length === 3 && index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
                onClick={module.onClick}
              >
                <div className={'text-[#390BC6] dark:text-blue-500'}>
                  {module.icon}
                </div>
                <p className={'font-semibold dark:text-gray-200 text-center px-2'}>{module.title}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
