import Image from 'next/image';
import { PasswordInput } from '@/components/PasswordInput';
import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserStudent } from '@/interfaces/User'
import Modal from '@/components/Modal/Modal';
import { axiosInstance } from "@/lib/axios";
import { handleAxiosError } from '@/utils/generatePassword';
import { useUserStore } from '@/store/userStore';

interface PropsPortalSimulatorSignIn {
  id: string
  isOpenModal: boolean
  setIsOpenModal: (status: boolean) => void;
}

export default function LoginStudentsModal({id, isOpenModal, setIsOpenModal}: PropsPortalSimulatorSignIn) {
  const [userStudent, setUserStudent] = useState<UserStudent>({
    name:'',
    email: '',
    password: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const setUserSimulator = useUserStore(state => state.setUserSimulator);

  const hadleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      alert('Por favor, completa todos los campos del formulario y acepta los términos y condiciones.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth-simulators/sign-in-simulator', { simulatorId: id, password: userStudent.password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      // Actualizar el userStore
      setUserSimulator({
        fullName: userStudent.name,
        email: userStudent.email
      });

      // Guardar información del usuario en localStorage
      localStorage.setItem('userStudent', JSON.stringify({
        fullName: userStudent.name,
        email: userStudent.email
      }));

      setIsOpenModal(false);
      router.push('/simulator/exam');
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const isFormValid = userStudent.name && userStudent.email && userStudent.password && acceptTerms

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserStudent({
      ...userStudent,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
      <div className="w-full dark:bg-gray-900">
        <div className="mb-6 flex justify-center">
          <Image
            className="filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-[0_10px_8px_rgba(74,153,144,0.8)]"
            src="/images/image-1.png"
            alt="Logo de CENFI"
            width={200}
            height={200}
            priority={true}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        <form onSubmit={hadleSubmit}>
          <div className="flex flex-col justify-start mb-6 text-center">
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-200">
              ¡Comienza Ahora!
            </h1>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Ingresa tus credenciales para comenzar el simulador
            </p>
          </div>
          <div className="mb-4">
            <label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="name"
            >
              Nombre y Apellido
            </label>
            <input
              className="w-full mt-1 p-2 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="name"
              placeholder="Ingresa tu nombre y apellido"
              required
              value={userStudent.name}
              onChange={handleGetDataInput}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-sm font-medium text-gray-900 dark:text-gray-200"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="w-full mt-1 p-2 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              required
              value={userStudent.email}
              onChange={handleGetDataInput}
            />
          </div>
          <PasswordInput password={userStudent.password} handleGetDataInput={handleGetDataInput} />
          <div className="flex items-center mb-4 mt-4">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mr-2"
            />
            <label className="text-xs font-medium dark:text-gray-200" htmlFor="acceptTerms">
              Acepto los términos y condiciones de uso.
            </label>
          </div>
          <button
            type="submit"
            className={`text-white text-sm font-bold w-full border dark:border-none rounded-md p-2 hover:bg-blue-800
              transition-colors duration-200 bg-button-color ${!isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Simulador'}
          </button>
        </form>
      </div>
    </Modal>
  );
}
