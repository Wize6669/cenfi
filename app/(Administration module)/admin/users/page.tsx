'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'; // Importa los íconos
import {IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import UserTable from '@/components/UserTable';


// Componente PasswordInput
const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mb-3">
      <label
        className="text-base font-medium text-gray-900 dark:text-gray-300"
        htmlFor="password"
      >
        Contraseña
      </label>
      <div className="relative">
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-blue-400"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Ingresa una contraseña"
          required={true}
          style={{ width: '450px', height: '35px' }}// tamaño del recuadro
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );

};

export default function Users() {
  const userAuth = useAuthStore((state) => state.userAuth);
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

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
      <div className={'flex flex-col min-h-screen dark:bg-gray-900'}>
        <div className={'flex-grow flex flex-col justify-center items-center'}>
          <div className={'justify-center gap-2 border-2 rounded-md w-[330px] h-[100px] px-2.5 py-1.5 dark:bg-gray-700'}>
            <p className={'text-center font-bold text-3xl mb-3 dark:text-gray-200'}>⚠️ Inicia sesión ⚠️</p>
            <p className={'text-base dark:text-gray-200'}>Redirigiendo a la página de Log In <b>...</b></p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const goBack = () => {
    router.back();
  };

  const handleSelectChange = () => {
    setIsSelectOpen(false);
  };


  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col justify-stretch items-center'}>
        <h1 className={'font-bold text-3xl mt-4 text-gray-900 dark:text-gray-200'}>Administración de Usuarios</h1>

        <div className={'flex justify-between items-center container w-full'}>
          <div className={'pr-8'}>
            <IconButton sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className="text-gray-400 dark:text-gray-300"/>
            </IconButton>
          </div>
          <div className="border-t-2 container w-full dark:border-gray-600"/>
        </div>

        <form className={"grid grid-rows-2 grid-flow-col gap-x-10 gap-y-4 pt-8"}>
          <div className={'flex flex-col mb-3'}>
            <label
              className={'text-base font-medium text-gray-900 dark:text-gray-300'}
              htmlFor={'fullName'}>Nombre y Apellido
            </label>
            <input
              className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-800 dark:text-gray-200 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'}
              type={'text'}
              name={'fullName'}
              placeholder={'Ingresa tu nombre y apellido'}
              required={true}
              style={{width: '450px', height: '35px'}}
            />
          </div>

          <PasswordInput/>

          <div className={'flex flex-col mb-3'}>
            <label
              className={'text-base font-medium text-gray-900 dark:text-gray-300'}
              htmlFor={'email'}>Correo
            </label>
            <input
              className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-800 dark:text-gray-200 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'}
              type={'email'}
              name={'email'}
              placeholder={'Ingresa tu correo electrónico'}
              style={{width: '450px', height: '35px'}}
            />
          </div>

          <div className={'flex flex-col mb-3 w-1/2'}>
            <label
              className={'text-base font-medium text-gray-900 dark:text-gray-300'}
              htmlFor={'roleId'}>Rol
            </label>
            <div className={'relative'}>
              <select
                className={'border border-gray-300 dark:border-gray-600 rounded-md w-full py-1.5 px-1.5 pr-8 bg-white dark:bg-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all ease-in-out duration-200'}
                name={'roleId'}
                required={true}
                style={{height: '35px'}}
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
                onChange={handleSelectChange}
              >
                <option value=''>Selecciona un rol</option>
                <option value='1'>Admin</option>
                <option value='2'>Profesor</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {isSelectOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </form>

        <button
          className={'bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-4 transition-colors ease-in-out duration-200'}>
          Registrar
        </button>
      </div>
  <div className="flex justify-center">
    <div className="w-2/3 scale-90">
      <UserTable/>
    </div>
  </div>
  <Footer/>
</div>
)
  ;
}
