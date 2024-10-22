'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModuleListNavbar from '@/components/ModulesList/ModuleListNavbar';
import React, { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import UserTable from '@/components/UserTable/UserTable';
import { PasswordInput } from '@/components/PasswordInput';
import { UserNewUpdate } from '@/interfaces/User';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { Pagination } from '@/interfaces/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GoBackButton from '@/components/GoBackButton';
import { handleAxiosError } from '@/utils/generatePassword';

export default function Users() {
  const userAuth = useAuthStore((state) => state.userAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [user, setUser] = useState<UserNewUpdate>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    roleId: null,
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: true,
    previousPage: 0,
    nextPage: 0,
    total: 0,
    pageSize: 10
  });
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = useQueryClient();
  const {data: users, isLoading} = useQuery({
    queryFn: () => fetchUser(),
    queryKey: ['users', pagination.currentPage, pagination.pageSize],
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({...prev, currentPage: newPage}));
      const urlParams = new URLSearchParams({page: newPage.toString(), count: pagination.pageSize.toString()}); // Update both page and count params
      router.push(`/admin/users?${urlParams.toString()}`);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({...prev, pageSize: newPageSize}));
    const urlParams = new URLSearchParams({page: pagination.currentPage.toString(), count: newPageSize.toString()}); // Update both page and count params
    router.push(`/admin/users?${urlParams.toString()}`);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await addUserMutation();
  };

  const fetchUser = async () => {
    const response = await axiosInstance.get(`/users?page=${pagination.currentPage}&count=${pagination.pageSize}`);
    const {
      data,
      currentPage,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      total
    } = response.data;
    setPagination(prev => ({
      ...prev,
      currentPage,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      total,
    }));

    return data;
  };

  const addUser = async () => {
    try {
      await axiosInstance.post('/auth/sign-up', user);
      toast.success('Usuario creado con éxito');

      resetForm();
    } catch (error) {
      handleAxiosError(error);

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
  };

  const {mutateAsync: addUserMutation} = useMutation({
    mutationFn: addUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['users']});
    }
  });

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

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1
              className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}
            >Administración
              de
              Usuarios</h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <GoBackButton/>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <form
          className={'container mt-2 grid md:grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:w-1/2 md:w-4/5 sm:px-6 lg:px-0 px-6'}
          ref={formRef} onSubmit={handleSubmit}
        >
          {/* Nombre y Apellido */}
          <div>
            <div className={'content-start'}>
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'fullName'}
              >
                Nombre y Apellido
              </label>
            </div>
            <div>
              <input
                className={'text-sm sm:text-base md:text-base peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                  '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type={'text'}
                name={'fullName'}
                onChange={handleGetFullNameInput}
                placeholder={'Ingresa un nombre y un apellido'}
                required={true}
                minLength={3}
              />
              <p className='absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs'>
                Ingresa un nombre válido ejm: Juan Pérez.
              </p>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <div className='content-start'>
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'email'}
              >
                Correo Electrónico
              </label>
            </div>
            <div>
              <input
                className={'text-sm sm:text-base md:text-base peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                  '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type={'email'}
                name={'email'}
                required={true}
                onChange={handleGetDataInput}
                placeholder={'Ingresa un correo electrónico'}
              />
              <p className='absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs'>
                Ingresa un correo válido. Ejm: you@example.com
              </p>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <PasswordInput password={user.password} handleGetDataInput={handleGetDataInput}/>
          </div>

          {/* Selección de Rol */}
          <div>
            <div className={'content-start lg:w-2/4 md:w-3/4 sm:w-full'}>
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'roleId'}
              >
                Rol
              </label>
              <div className={'relative'}>
                <select
                  className={'sm:text-base md:text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm w-full py-1.5 px-1.5 pr-8 bg-white dark:bg-gray-700 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all ease-in-out duration-200'}
                  name={'roleId'}
                  onChange={handleGetDataSelect}
                  required={true}
                  style={{height: '35px', maxWidth: '100%'}}
                  onFocus={() => setIsSelectOpen(true)}
                  onBlur={() => setIsSelectOpen(false)}
                >
                  <option value=''>Selecciona un rol</option>
                  <option value='1'>Admin</option>
                  <option value='2'>Profesor</option>
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
          </div>
          <div className={'col-span-full flex justify-center items-center'}>
            <button
              className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
              type={'submit'}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
      <div className={'flex-grow flex justify-center'}>
        <div className='w-full md:w-5/6 lg:w-2/3 scale-90'>
          {!isLoading && <UserTable
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            data={users}
            pagination={pagination}
          />}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
