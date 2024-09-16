'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import {ThemeToggle} from "@/components/ThemeToggle";
import { motion } from 'framer-motion';
import { PasswordInput } from '@/components/PasswordInput';
import React, {ChangeEvent, useState} from "react";
import {UserSingIn} from "@/interfaces/User";

export default function LoginStudents() {

  const [userSimulator, setUser] = useState<UserSingIn>({
    email: '',
    password: '',
    roleId: null,
  });

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...userSimulator,
      [event.target.name]: event.target.value
    });
  };

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
            <form className={'w-full max-w-sm'}>
              <div className={'flex flex-col justify-start mb-8 text-center'}>
                <h1 className={'text-3xl font-medium text-gray-900 dark:text-gray-200'}>
                  ¡Comienza Ahora!
                </h1>
                <p className={'text-md font-medium text-gray-700 dark:text-gray-400'}>
                  Ingresa tus credenciales para comenzar el simulador
                </p>
              </div>

              <div className={'gap-x-0 pb-3'}>
                <div className="content-end">
                  <label
                    className={'text-base font-medium text-gray-900 dark:text-gray-300'}
                    htmlFor="fullName"
                  >
                    Nombre y Apellido
                  </label>
                </div>
                <div>
                  <input
                    className={'peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                      '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                    type="text"
                    name="fullName"
                    placeholder="Ingresa el nombre de la nueva categoría"
                    required={true}
                  />
                  <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
                    Ingresa un nombre válido.
                  </p>
                </div>
              </div>

              <div className={'relative flex flex-col mb-3'}>
                <label
                  className={'text-md font-medium text-gray-900 dark:text-gray-200'}
                  htmlFor={'email'}
                >
                  Correo electrónico
                </label>
                <input
                  className={
                    'peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                    '          peer-valid:border-green-500 peer-invalid:border-pink-600'
                  }
                  type={'email'}
                  placeholder={'Ingresa tu email'}
                  name={'email'}
                  //value={user.email}
                  //onChange={handleGetDataInput}
                  required={true}
                />
                <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs bottom-[-17px]">
                  Por favor ingresa un correo electrónico válido.
                </p>
              </div>
              <PasswordInput password={userSimulator.password} handleGetDataInput={handleGetDataInput}/>
              <div className={'flex gap-1 mb-3 mt-5 items-center'}>
                <input
                  type={'checkbox'}
                  name={'isRemembered'}
                  id={'isRemembered'}
                  //checked={isRememberCredentials}
                  //onChange={handleCheckBox}
                />
                <label className={'text-xs font-medium dark:text-gray-200'} htmlFor={'isRemembered'}>
                  Acepto los términos y condiciones de uso.
                </label>
              </div>

              <button
                type={'submit'}
                className={
                  `text-white text-sm font-bold w-full border rounded-md p-2 hover:bg-blue-800 transition-colors duration-200 bg-button-color cursor-progress' : 'bg-[#627BCF]'}`
                }
              >
                Iniciar Simulador
              </button>
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
