'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import DynamicInputs from "@/components/DynamicInputs";
import PasswordInputSimulator from "@/components/PasswordInputSimulator";
import RadioNavigation from "@/components/RadioNavigation";
import RadioVisible from "@/components/RadioVisible";
import { Simulator, SimulatorCreate, CategoryQuestions } from "@/interfaces/Simulator";
import RadioReview from "@/components/RadioReview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import axios from 'axios';

export default function NewSimulator() {
  const [visibilidad, setVisibilidad] = useState<boolean | null>(null)
  const [revision, setRevision] = useState<boolean | null>(null)
  const [navegacionLibre, setNavegacionLibre] = useState<boolean | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const [dynamicInputs, setDynamicInputs] = useState<CategoryQuestions[]>([{ categoryId: 0, numberOfQuestions: 0 }])

  const [simulator, setSimulator] = useState<Simulator>({
    name: '',
    password: '',
    duration: 0,
    visibility: false,
    navigate: false,
    review: false,
    categoryQuestions: []
  });

  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSimulator({
      ...simulator,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }

    setSimulator({
      name: '',
      password: '',
      duration: 0,
      visibility: false,
      navigate: false,
      review: false,
      categoryQuestions: []
    });
    setVisibilidad(null);
    setRevision(null);
    setNavegacionLibre(null);
    setDynamicInputs([{ categoryId: 0, numberOfQuestions: 0 }]);
  };

  const goBack = () => {
    router.push('/admin/menu');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (visibilidad === null || navegacionLibre === null || revision === null || dynamicInputs.some(input => input.categoryId === 0 || input.numberOfQuestions === 0)) {
      setShowErrors(true)
      return
    }
    await addSimulatorMutation()
  }

  const addSimulator = async () => {
    try {
      const simulatorData: Simulator = {
        ...simulator,
        visibility: visibilidad!,
        navigate: navegacionLibre!,
        review: revision!,
        categoryQuestions: dynamicInputs.map(input => ({
          categoryId: input.categoryId,
          numberOfQuestions: input.numberOfQuestions
        }))
      };

      const response = await axiosInstance.post<SimulatorCreate>('/simulators', simulatorData);
      toast.success("Simulador creado con éxito!");
      resetForm();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Ocurrió un error al crear el simulador';
        toast.error(errorMessage);
      } else {
        toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');
      }
      console.error('Error creando el simulator:', error);
    }
  }

  const { mutateAsync: addSimulatorMutation } = useMutation({
    mutationFn: addSimulator,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['simulators'] });
    }
  });

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1
              className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>
              Configuración del Nuevo Simulador
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <IconButton className={'dark:border-gray-500 dark:hover:bg-gray-600'} sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-500'}/>
            </IconButton>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <form onSubmit={handleSubmit}
              className={'mt-2 grid md:grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:w-1/2 md:w-4/5'}
              ref={formRef}
        >
          <div>
            <div className={'content-start'}>
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'name'}
              >
                Título
              </label>
            </div>
            <div>
              <input
                className={'text-sm sm:text-base md:text-base peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20\n' +
                  '          peer-valid:border-green-500 peer-invalid:border-pink-600'}
                type={'text'}
                name={'name'}
                onChange={handleGetDataInput}
                placeholder={'Ingresa el título del simulador'}
                required={true}
                minLength={3}
              />
              <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
                El título debe contener mínimo 3 caracteres.
              </p>
            </div>
          </div>
          <div>
            <div className="content-start">
              <label
                className={'text-sm sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300'}
                htmlFor={'duration'}
              >
                Duración
              </label>
            </div>
            <div>
              <input
                className={'text-sm sm:text-base md:text-base w-full h-[35px] px-3 py-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
                type={'number'}
                name={'duration'}
                min={'1'}
                required={true}
                onChange={handleGetDataInput}
                placeholder={'Ingresa la duración del simulador en minutos, ejm: 80'}
              />
            </div>
          </div>

          <div>
            <PasswordInputSimulator
              password={simulator.password}
              handleGetDataInput={handleGetDataInput}
            />
          </div>

          <RadioNavigation
            value={navegacionLibre}
            onChange={(value) => setNavegacionLibre(value)}
            showError={showErrors}
          />
          <RadioVisible
            value={visibilidad}
            onChange={(value) => setVisibilidad(value)}
            showError={showErrors}
          />
          <RadioReview
            value={revision}
            onChange={(value) => setRevision(value)}
            showError={showErrors}
          />
          <div className={'col-span-full'}>
            <DynamicInputs
              inputs={dynamicInputs}
              onInputsChange={(inputs: CategoryQuestions[]) => setDynamicInputs(inputs)}
            />
          </div>
          <div className={'col-span-full flex justify-center items-center mb-3'}>
            <button
              className={'text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-1 transition-colors ease-in-out duration-200'}
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
  );
}
