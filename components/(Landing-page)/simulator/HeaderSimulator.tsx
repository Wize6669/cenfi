import React from 'react'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface HeaderSimulatorProps {
  currentQuestion: number
  totalQuestions: number
  onExitOrFinish: () => void
}

const HeaderSimulator: React.FC<HeaderSimulatorProps> = ({currentQuestion, totalQuestions, onExitOrFinish}) => {

  return (
    <header className={'select-none dark:bg-gray-900 bg-gray-100 p-4'}>
      <div className="select-none container mx-auto">
        <div className="flex items-center justify-between sm:justify-center">
          <div className="flex items-center sm:justify-start">
            <Image
              className="w-16 h-12 lg:w-24 lg:h-16 sm:justify-start filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)]"
              src="/images/image-1.png"
              alt="CENFI Logo"
              width={90}
              height={85}
            />
          </div>
          <div className="flex-grow hidden sm:block">
            <h1
              className="text-base md:text-2xl lg:text-3xl font-bold flex justify-center dark:text-gray-400 text-blue-900">
              Simuladores Preuniversitario CENFI
            </h1>
            <h2 className="text-sm md:text-lg lg:text-2xl font-medium flex justify-center mt-3 dark:text-gray-400">
              Simulador Universidad Nacional de Loja
            </h2>
          </div>
          <div className="flex-grow lg:hidden md:hidden">
            <h1
              className="text-base md:text-2xl lg:text-3xl font-bold flex justify-center dark:text-gray-400 text-blue-900">
              SIMULADOR CENFI
            </h1>
          </div>
          <div className="sm:flex-grow-0 sm:justify-end">
            <ThemeToggle/>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            className="flex items-center text-red-500 hover:text-red-700 mr-4"
            onClick={onExitOrFinish}
          >
            <LogOut className="w-5 h-5 lg:w-6 lg:h-6 mr-1"/>
            <span className="text-sm sm:text-base">
              {currentQuestion === totalQuestions ? 'Finalizar' : 'Salir'}
            </span>
          </button>
          <div className="w-full row-start-2 content-center justify-items-center">
            <div className={'border-t-2 container dark:border-gray-700 border-gray-300'} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderSimulator
