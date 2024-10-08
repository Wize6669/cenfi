import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {UserModalUpdate} from '@/interfaces/User';
import {axiosInstance} from '@/lib/axios';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';
import {ErrorResponse} from '@/interfaces/ResponseAPI';
import {useClipboardCopy} from '@/hooks/useClipboardCopy';
import {FaRegCopy} from 'react-icons/fa6';
import {generatePassword} from "@/utils/generatePassword";
import {Pagination} from "@/interfaces/Pagination";

interface PropsUserForm {
  id: string
}

export default function UserForm({id}: PropsUserForm) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [user, setUser] = useState<UserModalUpdate>({
    name: '',
    lastName: '',
    email: '',
    role: '',
  });
  const copyToClipboard = useClipboardCopy();
  const [newPassword, setNewPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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

  useEffect(() => {
    axiosInstance.get(`/users/${id}`).then((response) => {
      const {name, lastName, email, role} = response.data;
      setUser({...user, name, lastName, email, role})

    }).catch(error => {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
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
      }

      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');

      if (formRef.current) {
        formRef.current.reset();
      }

      setUser({
        name: '',
        lastName: '',
        email: '',
        role: '',
      });
    });
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

  const handleGetFullNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    const fullName = event.target.value;
    const fullNameAux = fullName.split(' ');
    setUser({
      ...user,
      name: fullNameAux[0],
      lastName: fullNameAux[1]
    });
  };

  const handleCopyClick = async () => {
    await copyToClipboard(newPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleChecked = async (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.checked) {

      return setIsChecked(false);
    }

    const newPassword  = generatePassword(8);
    await handleChangePassword(newPassword);
    setNewPassword(newPassword);
    setIsChecked(event.target.checked);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axiosInstance.post('/auth/sign-up', user);
      toast.success('Usuario creado con éxito');

      resetForm();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
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
      }

      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');

      if (formRef.current) {
        formRef.current.reset();
      }

      resetForm();
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      await axiosInstance.put('/admin/reset-password', {
        email: user.email,
        newPassword
      });

      toast.success('Contraseña restablecida con éxito');
    } catch (e) {
      toast.error('No se pudo restablecer la contraseña');
    }
  }

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }

    setUser({
      name: '',
      lastName: '',
      email: '',
      role: '',
    });
  };

  return (
    <div className={'flex flex-col h-1/3'}>
      <h1 className={'font-bold text-xl mt-4 mb-3'}>Editar Usuario</h1>

      <form className={'flex flex-col snap-y'} ref={formRef} onSubmit={handleSubmit}>
        <div>
          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium'} htmlFor={'fullName'}>
              Nombre Apellido
            </label>
            <input
              className={'border rounded-md p-2'}
              type={'text'}
              name={'fullName'}
              onChange={handleGetFullNameInput}
              value={user.name + " " + user.lastName}
              placeholder={'Ingresa tu nombre y apellido'}
              required={true}
              style={{width: '380px', height: '30px'}}
            />
          </div>

          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium'} htmlFor={'email'}>
              Correo
            </label>
            <input
              className={'border rounded-md p-2'}
              type={'email'}
              name={'email'}
              required={true}
              onChange={handleGetDataInput}
              value={user.email}
              placeholder={'Ingresa tu correo electrónico'}
              style={{width: '380px', height: '30px'}}
            />
          </div>

          <div className={'flex flex-col mb-3 w-full'}>
            <label className={'text-sm font-medium'} htmlFor={'roleId'}>
              Rol
            </label>
            <select
              className={'border rounded-md w-full py-1.5 px-1.5 pr-8 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-200'}
              name={'roleId'}
              onChange={handleGetDataSelect}
              value={user.role}
              required={true}
              style={{height: '30px'}}
            >
              <option value=''>Selecciona un rol</option>
              <option value='1'>Admin</option>
              <option value='2'>Profesor</option>
            </select>
          </div>
        </div>

        <hr/>

        <div>
          <div className={'flex justify-start items-center gap-x-2 mt-2'}>
            <input id={'resetPassword'}
                   name={'resetPassword'}
                   type={'checkbox'}
                   onChange={handleChecked}/>

            <label className={'text-sm font-medium'} htmlFor={'resetPassword'}>
              Restablecer contraseña
            </label>
          </div>

          {isChecked && <>
            <label className={'text-sm font-medium'} htmlFor={'newPassword'}>
              Contaseña temporal
            </label>

            <div className={'flex items-center justify-between border-2 rounded-md border-[#E5E7EB] px-1.5'}>
              <input
                type={'text'}
                name={'newPassword'}
                value={newPassword}
                readOnly={true}
              />
              <button
                type='button'
                onClick={handleCopyClick}
              >
                {isCopied ? <p className={'text-sm'}>✅ Copied</p> : <FaRegCopy/>}
              </button>
            </div>
          </>}
        </div>

        <div className={'flex justify-center items-center'}>
          <button className={'bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-4'}
                  type={'submit'}>
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
