'use client'

import { FaUser } from 'react-icons/fa';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { MdOutlineCategory } from 'react-icons/md';
import { IoIosSettings } from 'react-icons/io';
import {useAuthStore} from '@/store/auth';
import { useRouter } from 'next/navigation';
import React from "react";

export default function ModuleListCards() {
  const userAuth = useAuthStore((state) => state.userAuth);

  const router = useRouter();

  const handleUserModule = (event: React.MouseEvent<HTMLDivElement>) => {
    router.push('/admin/users');
  }

  return (
    <div className={'dark:bg-black'}>
      <div className={'my-5'}>
        <h1 className={'text-center text-3xl font-bold mb-2.5'}>Módulos</h1>

        <hr/>

      </div>
      <div className={'flex justify-between items-center gap-6'}>
        {userAuth?.roleId === 1 ? <div
          className={'flex flex-col gap-y-5 justify-center items-center bg-[#F1F9FB] rounded-md w-[200px] h-[175px] cursor-pointer shadow-lg'}
          onClick={handleUserModule}>
          <FaUser size={65} color={'390BC6'}/>
          <p className={'font-semibold'}>Gestión de Usuarios</p>
        </div> : <></>}

        <div
          className={'flex flex-col gap-y-5 justify-center items-center bg-[#F1F9FB] rounded-md w-[200px] h-[175px] cursor-pointer shadow-lg'}>
          <FaRegCircleQuestion size={65} color={'390BC6'}/>
          <p className={'font-semibold'}>Gestión de Preguntas</p>
        </div>

        <div
          className={'flex flex-col gap-y-5 justify-center items-center bg-[#F1F9FB] rounded-md w-[200px] h-[175px] cursor-pointer shadow-lg'}>
          <MdOutlineCategory size={65} color={'390BC6'}/>
          <p className={'font-semibold'}>Gestión de Categorías</p>
        </div>

        <div
          className={'flex flex-col gap-y-3.5 justify-center items-center bg-[#F1F9FB] rounded-md w-[200px] h-[175px] cursor-pointer shadow-lg'}>
          <IoIosSettings size={70} color={'390BC6'}/>
          <div className={'text-center items-center'}>
            <p className={'font-semibold'}>Configuración del</p>
            <p className={'font-semibold'}>Simulador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
