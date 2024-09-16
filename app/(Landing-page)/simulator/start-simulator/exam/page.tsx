'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, LogOut, Menu, X, Flag, Trash2, Clock, AlertTriangle, User} from 'lucide-react'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import {ThemeToggle} from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

interface Question {
  id: number;
  title: string;
  content: string;
  options: string[];
  section: string;
}

export default function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1)
  const [timeRemaining, setTimeRemaining] = useState<number>(310) // 19 horas en segundos
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string | null }>({})
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [fiveMinWarningShown, setFiveMinWarningShown] = useState<boolean>(false)

  const totalQuestions = 120 // Número total de preguntas
  const userName = "Juan Pérez" // Nombre del usuario

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 300 && !fiveMinWarningShown) { // 5 minutes left
          showFiveMinuteWarning()
          setFiveMinWarningShown(true) // Set the flag to true after showing the toast
        }
        return prevTime > 0 ? prevTime - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [fiveMinWarningShown])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleMarkQuestion = () => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion)
      } else {
        newSet.add(currentQuestion)
      }
      return newSet
    })
  }

  const handleAnswerSelect = (option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [currentQuestion]: option }))
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion))
  }

  const handleClearAnswer = () => {
    setSelectedOptions((prev) => ({ ...prev, [currentQuestion]: null }))
    setAnsweredQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentQuestion)
      return newSet
    })
  }

  const handleQuestionChange = (num: number) => {
    setCurrentQuestion(num)
    setSideMenuOpen(false)
  }

  const toastRef = useRef<string | null>(null)

  const handleExitOrFinish = () => {
    if (toastRef.current) {
      toast.dismiss(toastRef.current)
    }
    const action = currentQuestion === totalQuestions ? 'finalizar' : 'salir'
    toastRef.current = toast((t) => (
      <div className="user-select-none">
        <div className="flex items-center mb-2">
          <AlertTriangle className="mr-2 text-yellow-500" />
          <p>¿Estás seguro de que quieres {action}?</p>
        </div>
        <div className="mt-2 flex justify-between">
          <button
            className="mr-2 px-2 py-1 bg-red-500 text-white rounded-full"
            onClick={() => {
              console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}...`)
              toast.dismiss(t.id)
            }}
          >
            Sí, {action}
          </button>
          <button
            className="px-2 py-1 bg-blue-700 text-white rounded-full"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: Infinity })
  }

  const showFiveMinuteWarning = () => {
    toast.custom((t) => (
      <div
        className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {userName}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                ¡Atención! Te quedan 5 minutos para finalizar el intento.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    ), { duration: 10000 })
  }

  const questions: Question[] = [
    {
      id: 1,
      title: "Pregunta 1",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      section: "Razonamiento Lógico"
    },
    // Agregar más preguntas aquí...
  ]

  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0]

  // Componente de cuadrícula de preguntas
  const QuestionGrid = () => (
    <div className={'dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow'}>
      <h2 className={'text-base sm:text-lg md:text-xl font-semibold mb-5 mt-2 text-center flex items-center justify-center dark:text-white text-gray-800'}>
        <Clock className="mr-2" />
        Tiempo restante: {formatTime(timeRemaining)}
      </h2>
      <div className="grid grid-cols-9 gap-1">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-6 h-6 sm:w-8 sm:h-8 text-xs font-medium rounded-lg ${
              num === currentQuestion
                ? 'bg-sky-300 text-gray-800'
                : markedQuestions.has(num)
                  ? 'bg-orange-300 text-gray-800'
                  : answeredQuestions.has(num)
                    ? 'bg-green-300 text-gray-800'
                    : 'border dark:border-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            onClick={() => handleQuestionChange(num)}
          >
            {num.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={'min-h-screen flex flex-col dark:bg-gray-900 dark:text-white bg-gray-100 text-black user-select-none'}>
      {/* Header */}
      <header className={'dark:bg-gray-900 bg-gray-100 p-4'}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between sm:justify-center">
            <div className="flex items-center sm:justify-start">
              <Image className="sm:justify-start" src="/images/image-1.png" alt="CENFI Logo" width={90} height={85} />
            </div>
            <div className="flex-grow ml-4 hidden sm:block">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex justify-center">Simuladores Preuniversitario CENFI</h1>
              <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl font-medium flex justify-center mt-3">Simulador Universidad de Loja</h2>
            </div>
            <div className="sm:flex-grow-0 sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="flex items-center text-red-500 hover:text-red-700 mr-8"
              onClick={handleExitOrFinish}
            >
              <LogOut className="mr-2" />
              <span className="text-sm sm:text-base">{currentQuestion === totalQuestions ? 'Finalizar' : 'Salir'}</span>
            </button>
            <div className="w-full row-start-2 content-center justify-items-center">
              <div className={'border-t-2 container dark:border-gray-700 border-gray-300'} />
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo principal */}
      <main className="container mx-auto px-2 pb-2 flex-grow">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-end pb-2">
          <span className="text-xs sm:text-sm md:text-base"><span className="font-bold">Usuario: </span>juanperez@cenfi.com</span>
          <span className="text-xs sm:text-sm md:text-base"><span className="font-bold">Nombre: </span> {userName}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Menú lateral para móvil y tablet */}
          <div className={`lg:w-1/4 overflow-y-auto transition-all duration-300 ease-in-out ${
            sideMenuOpen ? 'fixed inset-0 z-50 bg-gray-800' : 'hidden lg:block'
          }`}>
            <div className="h-full p-0 relative">
              {sideMenuOpen && (
                <button
                  className="absolute top-2 right-2 p-2 bg-gray-700 rounded-full"
                  onClick={() => setSideMenuOpen(false)}
                >
                  <X className="h-6 w-6"/>
                </button>
              )}
              <QuestionGrid/>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <button
              className={'lg:hidden mb-4 p-2 dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-800 rounded'}
              onClick={() => setSideMenuOpen(true)}
            >
              <Menu className="h-6 w-6"/>
            </button>

            {/* Encabezado de la pregunta */}
            <div className={'dark:bg-gray-800 bg-gray-50 p-4 rounded-lg shadow mb-4'}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3
                  className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-0 order-1 sm:order-2">{currentQuestionData.section}</h3>
                <div className="order-2 sm:order-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Pregunta {currentQuestion}</h2>
                  <p
                    className={`text-sm sm:text-base ${answeredQuestions.has(currentQuestion) ? 'text-green-500' : 'text-gray-400'}`}>
                    {answeredQuestions.has(currentQuestion) ? 'Pregunta contestada' : 'Sin responder aún'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                <label
                  className={`flex items-center cursor-pointer ${markedQuestions.has(currentQuestion) ? 'text-orange-500' : ''} mb-2 sm:mb-0`}>
                  <input
                    type="checkbox"
                    checked={markedQuestions.has(currentQuestion)}
                    onChange={handleMarkQuestion}
                    className="hidden"
                  />
                  <Flag
                    className={`mr-2 h-4 w-4 ${markedQuestions.has(currentQuestion) ? 'text-orange-500' : 'text-gray-400'}`}/>
                  <span className="text-sm sm:text-base">Marcar pregunta</span>
                </label>
                {selectedOptions[currentQuestion] && (
                  <button
                    onClick={handleClearAnswer}
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4"/>
                    <span className="text-sm sm:text-base">Borrar selección</span>
                  </button>
                )}
              </div>
            </div>

            {/* Contenido de la pregunta */}
            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
              <p className="mb-6 text-sm sm:text-base md:text-lg">{currentQuestionData.content}</p>
              <div className="w-full flex items-center pb-5">
                <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
              </div>
              <div className="space-y-2">
                {currentQuestionData.options.map((option, index) => (
                  <label key={index}
                         className={'flex items-center p-2 rounded dark:hover:bg-gray-700 hover:bg-gray-100'}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOptions[currentQuestion] === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="mr-2"
                    />
                    <span className="text-sm sm:text-base">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between mt-4">
              {currentQuestion > 1 && (
                <button
                  className={'border dark:border-none dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-300 text-inherit font-semibold py-1 px-4 rounded-full inline-flex items-center'}
                  onClick={() => handleQuestionChange(currentQuestion - 1)}
                >
                  <ArrowLeft className="mr-2"/>
                  <span className="text-sm sm:text-base">Atrás</span>
                </button>
              )}
              {currentQuestion === 1 && <div></div>}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-full inline-flex items-center"
                onClick={() => {
                  if (currentQuestion < totalQuestions) {
                    handleQuestionChange(currentQuestion + 1)
                  } else {
                    handleExitOrFinish()
                  }
                }}
              >
                <span className="text-sm sm:text-base">
                  {currentQuestion < totalQuestions ? 'Siguiente' : 'Finalizar'}
                </span>
                {currentQuestion < totalQuestions && <ArrowRight className="ml-2"/>}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>

      <Toaster />
    </div>
  );
}
