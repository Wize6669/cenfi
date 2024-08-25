'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import { ChangeEvent, useState, FormEvent } from 'react';
import { UserSingIn } from '@/interfaces/User';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { config } from '@/config';
import { useAuthStore } from '@/store/auth';


export default function LoginAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserSingIn>({
    email: '',
    password: '',
    roleId: 0,
  });
  const [error, setError] = useState("");
  const setUserAuth = useAuthStore((state) => state.setUserAuth);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;
  const router = useRouter();

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

      setUserAuth({id, name, lastName, email, roleId });
      setIsLoggedIn(true);

      router.push('/menu');
    } catch (error) {
      setIsLoading(prev => !prev);

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.status === 400 ? 'Credenciales inválidas' : 'Hubo un error con el servidor';

        setError(errorMessage);

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  }

  return (
    <div className={'flex flex-col min-h-screen'}>
      <div className={'flex-grow flex flex-col justify-center items-center'}>
        <div className={'flex flex-row justify-center items-center w-full'}>
          <div className={'w-1/2 flex flex-col justify-center items-center'}>
            <div className={'mb-10'}>
              <Image src={'/images/image-1.png'} alt={'Logo de CENFI'} width={260} height={190}/>
            </div>

            <form onSubmit={handleSubmit} className={'w-full max-w-sm'}>
              <div className={'flex flex-col justify-start mb-8 text-center'}>
                <h1 className={'text-3xl font-medium'}>¡Bienvenido de nuevo!</h1>
                <p className={'text-base font-medium'}>Ingresa tus credenciales para iniciar sesión</p>
              </div>

              <div className={'flex flex-col mb-3'}>
                <label className={'text-sm font-medium'} htmlFor={'email'}>Correo electrónico</label>
                <input className={'border rounded-md p-2'}
                       type={'email'}
                       placeholder={'Ingresa tu email'}
                       name={'email'}
                       onChange={handleGetDataInput}
                       required={true}/>
              </div>

              <div className={'flex flex-col mb-3'}>
                <label className={'text-sm font-medium'} htmlFor={'password'}>Contraseña</label>
                <input className={'border rounded-md p-2'}
                       type={'password'}
                       placeholder={'Ingresa tu contraseña'}
                       name={'password'}
                       onChange={handleGetDataInput}
                       required={true}/>
              </div>

              <div className={'flex flex-col mb-3 w-1/2'}>
                <label className={'text-sm font-medium'} htmlFor={'roleId'}>Rol</label>
                <select className={'border rounded-md w-full p-2'}
                        name={'roleId'}
                        onChange={handleGetDataSelect}
                        required={true}>
                  <option value=''>Selecciona tu rol</option>
                  <option value='1'>Admin</option>
                  <option value='2'>Profesor</option>
                </select>
              </div>

              <div className={'flex gap-1 mb-3 items-center'}>
                <input type={'checkbox'} name={'isRemembered'} id={'isRemembered'}/>
                <label className={'text-xs font-medium'} htmlFor={'isRemembered'}>Recuérdame por 30
                  días</label>
              </div>

              <button type={'submit'}
                      className={`text-white text-sm font-bold w-full border rounded-md p-2 ${isLoading ? 'bg-[#627BCF] opacity-50 cursor-not-allowed' : 'bg-[#627BCF]'}`}
                      disabled={isLoading}>
                Iniciar sesión
              </button>

              {error && <span className={'text-red-500 text-sm'}>{error}</span>}
            </form>
          </div>
          <div className={'w-1/2 flex justify-center items-center'}>
            <Image src={'/images/image-2.png'} alt={'Icon'} width={555} height={619}/>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
