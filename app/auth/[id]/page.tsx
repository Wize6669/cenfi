'use client'

import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import React, {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import useTogglePasswordVisibility from "@/hooks/useTogglePasswordVisibility";

export default function ChangePassword() {
  const {id} = useParams();
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const {temporaryPassword, newPassword} = data;

    const saveSettings = async () => {
      try {
        const response = await axiosInstance.patch(`/users/change-password/${id}`,
          {temporaryPassword, newPassword});

        if (response.status === 200) {
          router.push('/admin');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.data)
        }
      }
    }
    await toast.promise(
      saveSettings(),
      {
        loading: 'Saving...',
        success: () => {
          setTimeout(() => {
            router.push('/admin');
          }, 2500);
          return <b>Contraseña actualizada!</b>;
        },
        error: <b>Could not save.</b>,
      },{
        duration: 2500,
      }
    );

    // try {
    //   const response = await axiosInstance.patch(`/users/change-password/${id}`,
    //     {temporaryPassword, newPassword});
    //
    //   if (response.status === 200) {
    //     router.push('/admin');
    //   }
    //   console.log(response.status);
    //   console.log(response.data);
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     console.log(error?.response?.data)
    //   }
    // }

  });

  const { showPassword, togglePasswordVisibility, Icon } = useTogglePasswordVisibility();

  return (
    <div className={'flex flex-col min-h-screen dark:bg-gray-900'}>
      <div className={'flex-grow flex justify-center items-center'}>
        <form onSubmit={onSubmit} className={'w-full max-w-sm'}>
          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium dark:text-gray-200'} htmlFor={'temporaryPassword'}>Contraseña
              temporal</label>
            <div className={'relative'}>
              <input
                className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400'}
                type={showPassword ? 'password' : 'text'}
                placeholder={'Ingresa la contraseña temporal'}
                id={'temporaryPassword'}
                {...register("temporaryPassword", {
                  required: {
                    value: true,
                    message: "Contraseña temporal es requerida*",
                  },
                  minLength: {
                    value: 3,
                    message:
                      "La contraseña debe tener un mínimo de 5 caracteres",
                  },
                })}/>
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {Icon}
              </button>
            </div>

            {errors.temporaryPassword && errors.temporaryPassword.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.temporaryPassword.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium dark:text-gray-200'} htmlFor={'newPassword'}>Nueva contraseña</label>
            <div className={'relative'}>
              <input className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400'}
                     type={showPassword ? 'password' : 'text'}
                     placeholder={'Ingresa tu nueva contraseña'}
                     id={'newPassword'}
                     {...register("newPassword", {
                       required: {
                         value: true,
                         message: "Contraseña es requerida*",
                       },
                       minLength: {
                         value: 3,
                         message:
                           "La contraseña debe tener un mínimo de 5 caracteres",
                       },
                     })}/>
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {Icon}
              </button>
            </div>

            {errors.newPassword && errors.newPassword.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.newPassword.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium dark:text-gray-200'} htmlFor={'newPasswordConfirmation'}>Repite la
              nueva
              contraseña</label>
            <div className={'relative'}>
              <input className={'border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full pr-10 transition-all ease-in-out duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400'}
                     type={showPassword ? 'password' : 'text'}
                     placeholder={'Ingresa de nuevo la nueva contraseña'}
                     id={'newPasswordConfirmation'}
                     {...register("newPasswordConfirmation", {
                       required: {
                         value: true,
                         message: "Confirmar Contraseña es requerido*",
                       },
                       validate: (value) =>
                         value === watch("newPassword") ||
                         "Las constraseñas no coinciden",
                     })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {Icon}
              </button>
            </div>

            {errors.newPasswordConfirmation && errors.newPasswordConfirmation.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.newPasswordConfirmation.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col justify-center items-center'}>
            <button type={'submit'}
                    className={'text-white dark:text-gray-200 text-sm font-bold w-1/2 border rounded-md p-2 bg-[#627BCF]'}>
              Guardar
            </button>
          </div>
        </form>
      </div>

      <Footer/>
    </div>
  );
}
