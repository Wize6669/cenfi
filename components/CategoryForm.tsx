import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {CategoryNewUpdate} from '@/interfaces/Categories';
import {axiosInstance} from '@/lib/axios';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';
import {ErrorResponse} from '@/interfaces/ResponseAPI';
import {useMutation, useQueryClient} from '@tanstack/react-query';


interface PropsUserForm {
  id: number
}

export default function UserForm({id}: PropsUserForm) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [category, setCategory] = useState<CategoryNewUpdate>({
    name: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    axiosInstance.get(`/categories/${id}`).then((response) => {
      const {name} = response.data;
      setCategory({...category, name})

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

      setCategory({
        name: '',
      });
    });
  }, []);

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCategory({
      ...category,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await updateCategoryMutation();
  };

  const updateCategory = async () => {
    try {
      const {name} = category;
      await axiosInstance.post(`/categories/${id}`, {
        name
      });

      toast.success('Categoría actualizada con éxito');
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
    }
  }

  const {mutateAsync: updateCategoryMutation} = useMutation({
    mutationFn: updateCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['categories']});
    }
  });

  return (
    <div className={'w-full flex flex-col h-1/3'}>
      <h1 className={'font-bold text-xl sm:text-base md:text-2xl mt-4 mb-3 flex justify-center dark:text-gray-200'}>Editar Categoría</h1>

      <form className={'flex flex-col snap-y'} ref={formRef} onSubmit={handleSubmit}>
        <div>
          <div className={'flex flex-col mb-3'}>
            <label className={'text-sm sm:text-base md:text-base font-medium dark:text-gray-200 mb-1'} htmlFor={'name'}>
              Categoría
            </label>
            <input
              className={'w-full text-sm sm:text-base md:text-base border rounded-md p-2 shadow-sm dark:bg-gray-700 dark:border-none dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'}
              type={'text'}
              name={'name'}
              onChange={handleGetDataInput}
              value={category.name}
              placeholder={'Ingresa el nomnbre de la categoría'}
              required={true}
              style={{ height: '35px'}}
            />
          </div>
        <div className={'flex justify-center items-center'}>
          <button className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-4'}
                  type={'submit'}>
            Actualizar
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}

