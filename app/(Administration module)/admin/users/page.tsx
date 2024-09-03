'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'; // Importa los íconos
import {IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import UserTable from '@/components/UserTable';

// Componente PasswordInput
const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mb-3">
      <label className="text-base font-medium" htmlFor="password">
        Contraseña
      </label>
      <div className="relative">
        <input
          className="border rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Ingresa una contraseña"
          required={true}
          style={{ width: '450px', height: '35px' }} // tamanio del recuadro
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
          ) : (
            <Eye className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
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
    <div className={'flex flex-col min-h-screen'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col justify-stretch items-center'}>
        <h1 className={'font-bold text-3xl mt-4'}>Administración de Usuarios</h1>

        <div className={'flex justify-between items-center container w-full'}>
          <div className={'pr-8'}>
            <IconButton sx={{border: '1px solid #ccc'}}>
              <ArrowBack/>
            </IconButton>
          </div>
          <div className="border-t-2 container w-full"/>
        </div>


        <form className={"grid grid-rows-2 grid-flow-col gap-x-10 gap-y-4 pt-8"}>
          <div className={'flex flex-col mb-3'}>
            <label
              className={'text-base font-medium'}
              htmlFor={'fullName'}>Nombre y Apellido
            </label>
            <input
              className={'border rounded-md p-2'}
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
              className={'text-base font-medium'}
              htmlFor={'email'}>Correo
            </label>
            <input
              className={'border rounded-md p-2'}
              type={'email'}
              name={'email'}
              placeholder={'Ingresa tu correo electrónico'}
              style={{width: '450px', height: '35px'}}
            />
          </div>

          <div className={'flex flex-col mb-3 w-1/2'}>
            <label
              className={'text-base font-medium'}
              htmlFor={'roleId'}>Rol
            </label>
            <div className={'relative'}>
              <select
                className={'border rounded-md w-full py-1.5 px-1.5 pr-8 text-gray-400 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200 text-black:not([value=""])'}
                name={'roleId'}
                required={true}
                style={{height: '35px'}}
              >
                <option
                  value=''>Selecciona un rol
                </option>
                <option
                  value='1'>Admin
                </option>
                <option
                  value='2'>Profesor
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </form>
        <button className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-4'}>
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
  );
}
