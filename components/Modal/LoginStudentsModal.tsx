import Image from 'next/image';
import { PasswordInput } from '@/components/PasswordInput';
import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Modal from '@/components/Modal/Modal';


export default function LoginStudentsModal({ isOpenModal, setIsOpenModal }: { isOpenModal: boolean, setIsOpenModal: (status: boolean) => void }) {
  const { userSimulator, setUserSimulator } = useUserStore()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const handleGetDataInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserSimulator({
      ...userSimulator,
      [event.target.name]: event.target.value,
    })
  }

  const handleClickStart = (event: React.FormEvent) => {
    event.preventDefault()
    if (acceptTerms && userSimulator.fullName && userSimulator.email && userSimulator.password) {
      localStorage.setItem('userSimulator', JSON.stringify(userSimulator))
      setIsOpenModal(false)
      router.push('/simulator/start-simulator/exam')
    } else if (!acceptTerms) {
      alert('Por favor, acepta los términos y condiciones para continuar.')
    } else {
      alert('Por favor, completa todos los campos del formulario.')
    }
  }

  const isFormValid = userSimulator.fullName && userSimulator.email && userSimulator.password && acceptTerms

  return (
    <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
      <div className="w-full dark:bg-gray-900">
        <div className="mb-6 flex justify-center">
          <Image
            className="filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-[0_10px_8px_rgba(74,153,144,0.8)]"
            src="/images/image-1.png"
            alt="Logo de CENFI"
            width={200}
            height={146}
            priority={true}
          />
        </div>
        <form onSubmit={handleClickStart}>
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
              htmlFor="fullName"
            >
              Nombre y Apellido
            </label>
            <input
              className="w-full mt-1 p-2 text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="fullName"
              placeholder="Ingresa tu nombre y apellido"
              required
              value={userSimulator.fullName}
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
              value={userSimulator.email}
              onChange={handleGetDataInput}
            />
          </div>
          <PasswordInput password={userSimulator.password} handleGetDataInput={handleGetDataInput} />
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
            className={
              `text-white text-sm font-bold w-full border dark:border-none rounded-md p-2 hover:bg-blue-800 transition-colors duration-200 bg-button-color cursor-progress ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`
            }
            disabled={!isFormValid}
          >
            Iniciar Simulador
          </button>
        </form>
      </div>
    </Modal>
  );
}
