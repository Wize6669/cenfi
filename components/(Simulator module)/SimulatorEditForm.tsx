'use client';

import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import axios from 'axios';
import DynamicInputs from "@/components/DynamicInputs";
import PasswordInputSimulator from "@/components/PasswordInputSimulator";
import RadioNavigation from "@/components/RadioNavigation";
import RadioVisible from "@/components/RadioVisible";
import RadioReview from "@/components/RadioReview";
import { Simulator, CategoryQuestions } from "@/interfaces/Simulator";

interface SimulatorEditFormProps {
  simulatorId: string;
}

export default function SimulatorEditForm({ simulatorId }: SimulatorEditFormProps) {
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

  const { data: simulatorData, isLoading, error } = useQuery({
    queryKey: ['simulator', simulatorId],
    queryFn: () => axiosInstance.get<Simulator>(`/simulators/${simulatorId}`).then(res => res.data),
  });

  useEffect(() => {
    if (simulatorData) {
      setSimulator(simulatorData);
      setVisibilidad(simulatorData.visibility);
      setRevision(simulatorData.review);
      setNavegacionLibre(simulatorData.navigate);
      setDynamicInputs(simulatorData.categoryQuestions || []);
    }
  }, [simulatorData]);

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSimulator({
      ...simulator,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (visibilidad === null || navegacionLibre === null || revision === null || dynamicInputs.some(input => input.categoryId === 0 || input.numberOfQuestions === 0)) {
      setShowErrors(true)
      return
    }
    await updateSimulatorMutation()
  }

  const updateSimulator = async () => {
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

      const response = await axiosInstance.post<Simulator>(`/simulators/${simulatorId}`, simulatorData);
      console.log('Datos actualizados', simulatorData)
      toast.success("Simulador actualizado con éxito!");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Ocurrió un error al actualizar el simulador';
        toast.error(errorMessage);
        console.log('Error en los datos enviados', error)
      } else {
        toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');
      }
      console.error('Error actualizando el simulator:', error);
    }
  }

  const { mutateAsync: updateSimulatorMutation } = useMutation({
    mutationFn: updateSimulator,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['simulators'] });
    }
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar el simulador</div>;

  return (
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
            value={simulator.name}
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
            value={simulator.duration}
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
          Actualizar Simulador
        </button>
      </div>
    </form>
  );
}
