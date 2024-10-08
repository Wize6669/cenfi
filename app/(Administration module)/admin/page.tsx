'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import React, {ChangeEvent, useState, useEffect, FormEvent} from 'react';
import {UserSingIn} from '@/interfaces/User';
import axios, {AxiosError} from 'axios';
import {useRouter} from 'next/navigation';
import {config} from '@/config';
import {useAuthStore} from '@/store/auth';
import {setCookie, getCookie} from 'cookies-next';
import {ThemeToggle} from '@/components/ThemeToggle';
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


  useEffect(() => {
    const credentials = getCookie('credentials');
    if (credentials) {
      const {email, password, roleId, isRememberCredentials} = JSON.parse(credentials);
      const roleIdAux = Number(roleId);
      setUser({email, password, roleId: roleIdAux});
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

      const {id, name, lastName, email, roleId} = data;

      if (isRememberCredentials) {
        const {email, password, roleId} = user;
        const credentials = JSON.stringify({email, password, roleId, isRememberCredentials: isRememberCredentials});
        setCookie('credentials', credentials, {maxAge: 30 * 24 * 60 * 60})
      }

      setUserAuth({id, name, lastName, email, roleId});
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
    <div className={'flex flex-col min-h-screen'}>
      <div className={'flex-grow flex flex-col justify-center items-center relative'}>
        <div className={'absolute top-2.5 right-5 p-4'}>
          <ThemeToggle/>
        </div>

        <div className={'flex flex-row justify-center items-center w-full'}>
          <div className={'w-1/2 flex flex-col justify-center items-center'}>
            <div className={'mb-10'}>
              <Image src={'/images/image-1.png'} alt={'Logo de CENFI'} width={260} height={190}/>
            </div>

            <form onSubmit={handleSubmit} className={'w-full max-w-sm'}>
              <div className={'flex flex-col justify-start mb-8 text-center'}>
                <h1 className={'text-3xl font-medium'}>¡Bienvenido de nuevo!</h1>
                <p className={'text-md font-medium'}>Ingresa tus credenciales para iniciar sesión</p>
              </div>

              <div className={'flex flex-col mb-3'}>
                <label className={'text-md font-medium'} htmlFor={'email'}>Correo electrónico</label>
                <input className={'border rounded-md p-2'}
                       type={'email'}
                       placeholder={'Ingresa tu email'}
                       name={'email'}
                       value={user.email}
                       onChange={handleGetDataInput}
                       style={{width: '385px', height: '35px'}}
                       required={true}/>
              </div>

              <PasswordInput password={user.password} handleGetDataInput={handleGetDataInput}/>

              <div className={'flex flex-col mb-3 w-1/2'}>
                <label className={'text-md font-medium'} htmlFor={'roleId'}>Rol</label>
                <div className={'relative'}>
                  <select
                    className={'border rounded-md w-full py-1.5 px-1.5 pr-8 text-black bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200'}
                    name={'roleId'}
                    onChange={handleGetDataSelect}
                    value={user.roleId || ''}
                    required={true}>
                    <option value=''>Selecciona tu rol</option>
                    <option value='1'>Admin</option>
                    <option value='2'>Profesor</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                    <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' strokeWidth='2'
                         viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={'flex gap-1 mb-3 items-center'}>
                <input type={'checkbox'}
                       name={'isRemembered'}
                       id={'isRemembered'}
                       checked={isRememberCredentials}
                       onChange={handleCheckBox}
                />
                <label className={'text-xs font-medium'} htmlFor={'isRemembered'}>Recuérdame por 30
                  días</label>
              </div>

              <button type={'submit'}
                      className={`text-white text-sm font-bold w-full border rounded-md p-2 hover:bg-blue-800
                      ${isLoading ? 'bg-[#627BCF] opacity-50 cursor-progress' : 'bg-[#627BCF]'}`}
                      disabled={isLoading}>
                Iniciar sesión
              </button>

              {error && <span className={'text-red-500 text-sm'}>{error}</span>}
            </form>
          </div>
          <div className={'w-1/2 flex justify-center items-center'}>
            <Image src={'/images/image-2.png'} alt={'Icon'} width={545} height={609}/>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
