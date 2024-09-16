'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModuleListNavbar from '@/components/ModulesList/ModuleListNavbar';
import React, {ChangeEvent, FormEvent, useEffect, useState, useRef} from 'react';
import {useAuthStore} from '@/store/auth';
import {useRouter} from 'next/navigation';
import {IconButton} from '@mui/material'
import {ArrowBack} from '@mui/icons-material';
import UserTable from '@/components/UserTable/UserTable';
import {PasswordInput} from '@/components/PasswordInput';
import {UserNewUpdate} from '@/interfaces/User';
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/interfaces/ResponseAPI';
import toast from 'react-hot-toast';


export default function Users() {
  const userAuth = useAuthStore((state) => state.userAuth);
  const [user, setUser] = useState<UserNewUpdate>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    roleId: null,
  });
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (userAuth?.roleId !== 1 || !isLoggedIn) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userAuth, router, isLoggedIn]);

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  const handleGetDataSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  };

  const handleGetFullNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    const fullName = event.target.value;
    const fullNameAux = fullName.split(' ');
    setUser({
      ...user,
      name: fullNameAux[0],
      lastName: fullNameAux[1]
    });
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }

    setUser({
      name: '',
      lastName: '',
      email: '',
      password: '',
      roleId: null,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axiosInstance.post('/auth/sign-up', user);
      toast.success('Usuario creado con éxito');

      resetForm();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.status)
        if(error?.response?.status === 400) {
          const errors = error?.response?.data.errors;
          const errorApi = error?.response?.data.error;

          if (Array.isArray(errors)) {
            const errorsMessages = errors
              .map((errorMessage: ErrorResponse) => errorMessage?.message)
              .join('\n');

            return toast.error(errorsMessages);
          }

          return toast.error(errorApi.message);
        }

        if (error?.response?.status === 409) {

          return toast.error('El usuario ya existe');
        }
      }

      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');

      if (formRef.current) {
        formRef.current.reset();
      }

      setUser({
        name: '',
        lastName: '',
        email: '',
        password: '',
        roleId: null,
      });
    }
  }

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
      <div className={'flex-grow flex flex-col items-center'}>
        <h1 className={'font-bold text-3xl mt-4'}>Administración de Usuarios</h1>

        <div className={'flex justify-between items-center w-full px-8'}>
          <div className={'pr-8'}>
            <IconButton sx={{border: '1px solid #ccc'}}>
              <ArrowBack/>
            </IconButton>
          </div>
          <div className={'border-t-2 w-full'}/>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className={'grid grid-cols-2 gap-x-10 gap-y-4 pt-8'}>
            <div className={'flex flex-col mb-3'}>
              <label className={'text-base font-medium'} htmlFor={'fullName'}>
                Nombre y Apellido
              </label>
              <input
                className={'border rounded-md p-2'}
                type={'text'}
                name={'fullName'}
                onChange={handleGetFullNameInput}
                placeholder={'Ingresa tu nombre y apellido'}
                required={true}
                style={{width: '450px', height: '35px'}}
              />
            </div>

            <PasswordInput password={user.password} handleGetDataInput={handleGetDataInput}/>

            <div className={'flex flex-col mb-3'}>
              <label className={'text-base font-medium'} htmlFor={'email'}>
                Correo
              </label>
              <input
                className={'border rounded-md p-2'}
                type={'email'}
                name={'email'}
                required={true}
                onChange={handleGetDataInput}
                placeholder={'Ingresa tu correo electrónico'}
                style={{width: '450px', height: '35px'}}
              />
            </div>

            <div className={'flex flex-col mb-3 w-full'}>
              <label className={'text-base font-medium'} htmlFor={'roleId'}>
                Rol
              </label>
              <div className={'relative'}>
                <select
                  className={'border rounded-md w-full py-1.5 px-1.5 pr-8 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200'}
                  name={'roleId'}
                  onChange={handleGetDataSelect}
                  required={true}
                  style={{height: '35px'}}
                >
                  <option value=''>Selecciona un rol</option>
                  <option value='1'>Admin</option>
                  <option value='2'>Profesor</option>
                </select>
              </div>
            </div>
          </div>

          <div className={'flex justify-center items-center'}>
            <button className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-4'}
                    type={'submit'}>
              Registrar
            </button>
          </div>
        </form>
      </div>

      <div className={'flex justify-center mb-5'}>
        <div className={'w-2/3'}>
          <UserTable/>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
