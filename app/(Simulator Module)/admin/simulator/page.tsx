'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, {ChangeEvent, FormEvent, useEffect, useState, useRef} from 'react';
import { useAuthStore } from "@/store/auth";
import { useRouter } from 'next/navigation';
import {IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import {UserNewUpdate} from '@/interfaces/User';
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/interfaces/ResponseAPI';
import toast from 'react-hot-toast';
import DynamicInputs from "@/components/DynamicInputs";
import PasswordInputSimulator from "@/components/PasswordInputSimulator";

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

  const goBack = () => {
    router.back();
  };


  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1 className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>Configuración del
              Simulador</h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <IconButton sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-300'}/>
            </IconButton>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <form className={'mt-2 grid md:grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:w-1/2 md:w-4/5'}
              ref={formRef} onSubmit={handleSubmit}
        >
          {/* Título del Simulador */}
          <div>
            <div className={'content-start'}>
              <label
                className={'text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'fullName'}
              >
                Título
              </label>
            </div>
            <div>
              <input
                className={'peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                  '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type={'text'}
                name={'fullName'}
                onChange={handleGetFullNameInput}
                placeholder={'Ingresa el título del simulador'}
                required={true}
                minLength={3}
              />
              <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
                El título debe contener mínimo 3 caracteres.
              </p>
            </div>
          </div>

          {/* Duración */}
          <div>
            <div className="content-start">
              <label
                className={'text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'number'}
              >
                Duración
              </label>
            </div>
            <div>
              <input
                className={'w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
                type={'number'}
                name={'duration'}
                min={'1'}
                required={true}
                onChange={handleGetDataInput}
                placeholder={'Ingresa la duración del simulador en minutos, ejm: 80'}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <PasswordInputSimulator password={user.password} handleGetDataInput={handleGetDataInput}/>
          </div>

          {/* Radio Button */}
          <div className={'flex flex-col space-y-1.5'}>
            <label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
              Navegación
            </label>
            <div
              className="flex flex-row items-center space-x-10 justify-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="option"
                  value="opcion1"
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base font-medium dark:text-gray-400">Libre</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="option"
                  value="opcion2"
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base font-medium dark:text-gray-400">Secuencial</span>
              </label>
            </div>
          </div>
          <div className={'col-span-full'}>
            <DynamicInputs/>
          </div>
          <div className={'col-span-full flex justify-center items-center'}>
            <button
              className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
              type={'submit'}
            >
              Crear Simulador
            </button>
          </div>
        </form>

      </div>
      <div className={'flex justify-center'}>
      </div>
      <Footer/>
    </div>
  )
    ;
}
