'use client'

import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

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
        error: <b>No se pudo actualizar la contraseña</b>,
      },{
        duration: 2500,
      }
    );
  });

  return (
    <div className={'flex flex-col min-h-screen'}>
      <div className={'flex-grow flex justify-center items-center'}>
        <form onSubmit={onSubmit} className={'w-full max-w-sm'}>
          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium'} htmlFor={'temporaryPassword'}>Contraseña
              temporal</label>
            <input className={'border rounded-md p-2'}
                   type={'password'}
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
            {errors.temporaryPassword && errors.temporaryPassword.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.temporaryPassword.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium'} htmlFor={'newPassword'}>Nueva contraseña</label>
            <input className={'border rounded-md p-2'}
                   type={'password'}
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
            {errors.newPassword && errors.newPassword.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.newPassword.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm font-medium'} htmlFor={'newPasswordConfirmation'}>Repite la nueva
              contraseña</label>
            <input className={'border rounded-md p-2'}
                   type={'password'}
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
            {errors.newPasswordConfirmation && errors.newPasswordConfirmation.message && (
              <span className={"text-red-500 text-sm"}>
                      {errors.newPasswordConfirmation.message.toString()}
                    </span>
            )}
          </div>

          <div className={'flex flex-col justify-center items-center'}>
            <button type={'submit'}
                    className={'text-white text-sm font-bold w-1/2 border rounded-md p-2 bg-[#627BCF]'}>
              Guardar
            </button>
          </div>
        </form>
      </div>

      <Footer/>
    </div>
  );
}
