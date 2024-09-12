'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import React, { ChangeEvent, useState, useEffect,FormEvent } from 'react';
import { UserSingIn } from '@/interfaces/User';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { config } from '@/config';
import { useAuthStore } from '@/store/auth';
import { setCookie, getCookie } from 'cookies-next';
import {ChevronDown, ChevronUp, Eye, EyeOff} from "lucide-react";
import {ThemeToggle} from "@/components/ThemeToggle";
import { motion } from 'framer-motion';
import {PasswordInput} from '@/components/PasswordInput';

export default function LoginAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserSingIn>({
    email: '',
    password: '',
    roleId: null,
  });
  const [error, setError] = useState("");
  const setUserAuth = useAuthStore((state) => state.setUserAuth);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;
  const router = useRouter();
  const [isRememberCredentials, setIsRememberCredentials] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    const credentials = getCookie('credentials');
    if(credentials) {
      const { email, password, roleId, isRememberCredentials } = JSON.parse(credentials);
      const roleIdAux = Number(roleId);
      setUser({ email, password, roleId:roleIdAux });
      setIsRememberCredentials(isRememberCredentials);
    }
  }, []);

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
    setIsSelectOpen(false);
  };

  const handleFocus = () => {
    setIsSelectOpen(true);
  };

  const handleBlur = () => {
    setIsSelectOpen(false);
  };

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRememberCredentials(event.target.checked);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${HOST_BACK_END}/api/v1/auth/sign-in`, user);
      const {data} = response
      setIsLoading(prev => !prev);
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      if (response.data.changePassword) {
        return router.push(`/auth/${response.data.id}`);
      }

      const {id, name, lastName, email, roleId } = data;

      if(isRememberCredentials) {
        const {email, password, roleId} = user;
        const credentials = JSON.stringify({email, password, roleId, isRememberCredentials: isRememberCredentials});
        setCookie('credentials',credentials, { maxAge: 30 * 24 * 60 * 60 })
      }

      setUserAuth({id, name, lastName, email, roleId });
      setIsLoggedIn(true);

      router.push('/admin/menu');
    } catch (error) {
      setIsLoading(prev => !prev);

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.status === 400 ? 'Credenciales inválidas'
          : 'Hubo un error con el servidor';

        setError(errorMessage);

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={'flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200'}>
      <div className={'flex-grow flex flex-col justify-center items-center relative'}>
        <div className={'absolute top-1 right-5 lg:p-4 md:p-4 sm:p-0'}>
          <ThemeToggle/>
        </div>
        <div className={'flex flex-col lg:flex-row justify-center items-center w-full px-4 md:px-10'}>
          {/* Columna de formulario */}
          <div className={'w-full lg:w-1/2 flex flex-col justify-center items-center'}>
            <div className={'mb-10'}>
              <Image
                className={
                  'filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-md'
                }
                src={'/images/image-1.png'}
                alt={'Logo de CENFI'}
                width={260}
                height={190}
                priority={true}
              />
            </div>

            <form onSubmit={handleSubmit} className={'w-full max-w-sm'}>
              <div className={'flex flex-col justify-start mb-8 text-center'}>
                <h1 className={'text-3xl font-medium text-gray-900 dark:text-gray-200'}>
                  ¡Bienvenido de nuevo!
                </h1>
                <p className={'text-md font-medium text-gray-700 dark:text-gray-400'}>
                  Ingresa tus credenciales para iniciar sesión
                </p>
              </div>

              <div className={'flex flex-col mb-3'}>
                <label
                  className={'text-md font-medium text-gray-900 dark:text-gray-200'}
                  htmlFor={'email'}
                >
                  Correo electrónico
                </label>
                <input
                  className={
                    'border rounded-md p-2 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-full'
                  }
                  type={'email'}
                  placeholder={'Ingresa tu email'}
                  name={'email'}
                  value={user.email}
                  onChange={handleGetDataInput}
                  required={true}
                  style={{height: '35px'}}
                />
              </div>
              <PasswordInput password={user.password} handleGetDataInput={handleGetDataInput}/>
              <div className={'flex flex-col my-3 dark:border-gray-800'}>
                <label
                  className={'text-md font-medium text-gray-900 dark:text-gray-200'}
                  htmlFor={'roleId'}
                >
                  Rol
                </label>
                <div className={'relative w-40'}>
                  <select
                    className={
                      'border border-gray-300 dark:border-gray-600 rounded-md w-full py-1.5 px-1.5 pr-8 bg-white dark:bg-gray-700 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all ease-in-out duration-200'
                    }
                    name={'roleId'}
                    onChange={handleGetDataSelect}
                    value={user.roleId || ''}
                    required={true}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option value={''}>Selecciona tu rol</option>
                    <option value={'1'}>Admin</option>
                    <option value={'2'}>Profesor</option>
                  </select>
                  <div className={'absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'}>
                    {isSelectOpen ? (
                      <ChevronUp className={'w-4 h-4 text-gray-600 dark:text-gray-400'}/>
                    ) : (
                      <ChevronDown className={'w-4 h-4 text-gray-600 dark:text-gray-400'}/>
                    )}
                  </div>
                </div>
              </div>

              <div className={'flex gap-1 mb-3 items-center'}>
                <input
                  type={'checkbox'}
                  name={'isRemembered'}
                  id={'isRemembered'}
                  checked={isRememberCredentials}
                  onChange={handleCheckBox}
                />
                <label className={'text-xs font-medium dark:text-gray-200'} htmlFor={'isRemembered'}>
                  Recuérdame por 30 días
                </label>
              </div>

              <button
                type={'submit'}
                className={
                  `text-white text-sm font-bold w-full border rounded-md p-2 hover:bg-blue-800 transition-colors duration-200
              ${isLoading ? 'bg-[#627BCF] opacity-50 cursor-progress' : 'bg-[#627BCF]'}`
                }
                disabled={isLoading}
              >
                Iniciar sesión
              </button>

              {error && <span className={'text-red-500 text-sm'}>{error}</span>}
            </form>
          </div>

          {/* Columna de imagen */}
          <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8}}
            className={'relative w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0'}
          >
            <Image
              className={
                'lg:w-2/3 hidden md:block md:w-1/3 md:mb-4 filter drop-shadow-[0_10px_8px_rgba(25, 82, 94, 0.46)] dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-md'
              }
              src={'/images/image-2.png'}
              alt={'Icon'}
              width={555}
              height={619}
              priority={true}
            />
          </motion.div>
        </div>
      </div>

      <Footer/>
    </motion.div>
  );
}
