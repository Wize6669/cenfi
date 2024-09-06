'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, {useEffect, useState} from "react";
import {useAuthStore} from "@/store/auth";
import {useRouter} from 'next/navigation';

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
    return (<div className={'flex flex-col min-h-screen'}>
      <div className={'flex-grow flex flex-col justify-center items-center'}>
        <div className={'justify-center gap-2 border-2 rounded-md w-[330px] h-[100px] px-2.5 py-1.5'}>
          <p className={'text-center font-bold text-3xl mb-3'}>⚠️ Inicia sesión ⚠️</p>
          <p className={'text-base'}>Redirigiendo a la página de Log In <b>...</b></p>
        </div>
      </div>
    </div>);
  }

  if (!isLoggedIn) {
    return null;
  }

  return(<div className={'flex flex-col min-h-screen'}>
    <Header>
      <ModuleListNavbar/>
    </Header>
    <div className={'flex-grow flex flex-col justify-stretch items-center'}>
      <h1 className={'font-bold text-2xl'}>Administración de Usuarios</h1>

      <div className={'border-t-2 container w-full'}></div>

      <form>
        <div>
          <label htmlFor={'fullName'}>Nombre y Apellido</label>
          <input type={'text'} name={'fullName'} placeholder={'Nombre y Apellido'}/>
        </div>

        <div>
          <label htmlFor={'password'}>Contraseña</label>
          <input type={'password'} name={'password'} placeholder={'Contraseña'}/>
        </div>

        <div>
          <label htmlFor={'email'}>Correo</label>
          <input type={'email'} name={'email'} placeholder={'Correo'}/>
        </div>

        <div className={'flex flex-col mb-3 w-1/2'}>
          <label className={'text-sm font-medium'} htmlFor={'roleId'}>Rol</label>
          <select className={'border rounded-md w-full py-2'}
                  name={'roleId'}
                  required={true}>
            <option value=''>Selecciona un rol</option>
            <option value='1'>Admin</option>
            <option value='2'>Profesor</option>
          </select>
        </div>
      </form>

    </div>
    <Footer/>
  </div>);
}
