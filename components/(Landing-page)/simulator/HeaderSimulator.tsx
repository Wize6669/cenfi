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
            <Image className="sm:justify-start filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)]" src="/images/image-1.png" alt="CENFI Logo" width={90} height={85} />
          </div>
          <div className="flex-grow ml-4 hidden sm:block">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex justify-center dark:text-gray-400 text-blue-900">
              Simuladores Preuniversitario CENFI
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl font-medium flex justify-center mt-3 dark:text-gray-400">
              Simulador Universidad Nacional de Loja
            </h2>
          </div>
          <div className="sm:flex-grow-0 sm:justify-end">
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            className="flex items-center text-red-500 hover:text-red-700 mr-8"
            onClick={onExitOrFinish}
          >
            <LogOut className="mr-2" />
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
