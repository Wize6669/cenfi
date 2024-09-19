'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ArrowLeft, ArrowRight, Menu, X, Flag, Trash2, Clock } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import HeaderSimulator from '@/components/(Landing-page)/simulator/HeaderSimulator'
import { useExitFinishToast } from '@/hooks/useExitFinishToast'
import { useFiveMinuteWarning } from '@/hooks/useFiveMinuteWarning'
import { useUserStore } from '@/store/userStore'

interface Question {
  id: number
  title: string
  content: string
  options: string[]
  section: string
  correctAnswer: string
  justification: string
}

export default function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1)
  const [timeRemaining, setTimeRemaining] = useState<number>(3000) // 1 hora en segundos
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string | null }>({})
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [fiveMinWarningShown, setFiveMinWarningShown] = useState<boolean>(false)
  const [isFreeNavigation, setIsFreeNavigation] = useState<boolean>(true)

  const router = useRouter()

  const { userSimulator } = useUserStore()

  const handleExit = () => {
    console.log("Saliendo del examen")
  }

  const questions: Question[] = useMemo(() => [
    {
      id: 1,
      title: "Pregunta 1",
      content: "¿Cuánto es 1 + 1?",
      options: ["3", "2", "2.1", "1"],
      section: "Razonamiento Lógico",
      correctAnswer: "2",
      justification: "La suma de 1 + 1 es igual a 2, que es el resultado básico de la adición de dos unidades."
    },
    {
      id: 2,
      title: "Pregunta 2",
      content: "¿Cuánto es 8 + 1?",
      options: ["3", "2", "9", "1"],
      section: "Razonamiento Lógico",
      correctAnswer: "9",
      justification: "La suma de 8 + 1 es igual a 9, que es el resultado básico de la adición de dos unidades."
    },
    {
      id: 3,
      title: "Pregunta 3",
      content: "¿Cuánto es 6 + 1?",
      options: ["3", "2", "7", "1"],
      section: "Razonamiento Lógico",
      correctAnswer: "7",
      justification: "La suma de 6 + 1 es igual a 7, que es el resultado básico de la adición de dos unidades."
    },
  ], [])

  const totalQuestions = questions.length

  const calculateScore = useCallback(() => {
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      if (selectedOptions[index + 1] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    return (correctAnswers / totalQuestions) * 100;
  }, [questions, selectedOptions, totalQuestions]);

  const saveExamData = useCallback(() => {
    const examData = {
      questions,
      userAnswers: selectedOptions,
      timeSpent: 3000 - timeRemaining,
      fullName: userSimulator.fullName,
      email: userSimulator.email,
      score: calculateScore(),
    }
    localStorage.setItem('examData', JSON.stringify(examData))
    localStorage.setItem('reviewAvailable', 'true')
    router.replace('/simulator/start-simulator/exam/score')
  }, [questions, selectedOptions, timeRemaining, router, calculateScore, userSimulator.fullName, userSimulator.email])

  const { showExitFinishToast } = useExitFinishToast(handleExit, saveExamData)
  const { showFiveMinuteWarning } = useFiveMinuteWarning(userSimulator.fullName ?? 'Usuario')

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 300 && !fiveMinWarningShown) {
          showFiveMinuteWarning()
          setFiveMinWarningShown(true)
        }
        if (prevTime === 0) {
          clearInterval(timer)
          saveExamData()
          return 0
        }
        return prevTime > 0 ? prevTime - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [fiveMinWarningShown, showFiveMinuteWarning, saveExamData])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleMarkQuestion = () => {
    if (isFreeNavigation) {
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
    if (isFreeNavigation || num === currentQuestion + 1) {
      setCurrentQuestion(num)
      setSideMenuOpen(false)
    }
  }

  const handleExitOrFinish = () => {
    const action = currentQuestion === totalQuestions ? 'finalizar' : 'salir'
    showExitFinishToast(action)
  }

  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0]

  const QuestionGrid = () => (
    <div className="dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-5 mt-2 text-center flex items-center justify-center dark:text-white text-gray-800">
        <Clock className="mr-2" />
        Tiempo restante: {formatTime(timeRemaining)}
      </h2>
      <div className="grid grid-cols-9 md:grid-cols-12 lg:grid-cols-9 gap-1">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-6 h-6 sm:w-8 sm:h-8 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-110 ${
              num === currentQuestion
                ? 'bg-sky-300 text-gray-800'
                : markedQuestions.has(num)
                  ? 'bg-orange-300 text-gray-800'
                  : answeredQuestions.has(num)
                    ? 'bg-green-300 text-gray-800'
                    : 'border dark:border-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            } ${!isFreeNavigation && num !== currentQuestion + 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleQuestionChange(num)}
            disabled={!isFreeNavigation && num !== currentQuestion + 1}
          >
            {num.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={'select-none min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'}>
      <HeaderSimulator
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onExitOrFinish={handleExitOrFinish}
      />

      <main className="container mx-auto px-2 pb-2 flex-grow">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-end pb-2">
          <span className="text-xs sm:text-sm md:text-base dark:text-gray-400">
            <span className="font-bold dark:text-gray-300">Usuario: </span>{userSimulator.email}
          </span>
          <span className="text-xs sm:text-sm md:text-base dark:text-gray-400">
            <span className="font-bold dark:text-gray-300">Nombre: </span> {userSimulator.fullName}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`lg:w-1/4 overflow-y-auto transition-all duration-300 ease-in-out ${
            sideMenuOpen ? 'fixed inset-0 z-50' : 'hidden lg:block'
          }`}>
            <div className="h-full relative">
              {sideMenuOpen && (
                <button
                  className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
                  onClick={() => setSideMenuOpen(false)}
                >
                  <X className="h-5 w-5"/>
                </button>
              )}
              <QuestionGrid/>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <button
                className={'p-1 dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-800 rounded border dark:border-none'}
                onClick={() => setSideMenuOpen(true)}
              >
                <Menu className="h-6 w-6"/>
              </button>
              <div className="lg:hidden flex items-center dark:bg-gray-800 bg-gray-50 p-2 rounded-lg">
                <Clock className="mr-2 h-5 w-5"/>
                <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-4 rounded-lg shadow mb-4 '}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3
                  className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-0 order-1 sm:order-2 dark:text-gray-400">
                  {currentQuestionData.section}
                </h3>
                <div className="order-2 sm:order-1">
                  <h2 className="text-lg sm:text-base md:text-xl font-bold dark:text-gray-300">Pregunta {currentQuestion}</h2>
                  <p className={`text-sm sm:text-base ${answeredQuestions.has(currentQuestion) ? 'text-green-500' : 'text-gray-400'}`}>
                    {answeredQuestions.has(currentQuestion) ? 'Pregunta contestada' : 'Sin responder aún'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                {isFreeNavigation && (
                  <label className={`flex items-center cursor-pointer dark:text-gray-400 ${markedQuestions.has(currentQuestion) ? 'dark:text-orange-500 text-orange-500' : ''} mb-2 sm:mb-0`}>
                    <input
                      type="checkbox"
                      checked={markedQuestions.has(currentQuestion)}
                      onChange={handleMarkQuestion}
                      className="hidden"
                    />
                    <Flag className={`mr-2 h-4 w-4 ${markedQuestions.has(currentQuestion) ? 'text-orange-500' : 'text-gray-400'}`}/>
                    <span className="text-sm sm:text-base">Marcar pregunta</span>
                  </label>
                )}
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

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
              <p className="mb-6 text-sm sm:text-base md:text-lg dark:text-gray-400">{currentQuestionData.content}</p>
              <div className="w-full flex items-center pb-5">
                <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
              </div>
              <div className="space-y-2">
                {currentQuestionData.options.map((option, index) => (
                  <label key={index}
                         className={'flex items-center p-2 rounded dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300 dark:text-gray-400'}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOptions[currentQuestion] === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="h-5 w-5 mr-2 rounded-full border text-blue-600 dark:text-blue-400 transition-colors duration-300"
                    />
                    <span className="text-sm sm:text-base mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-sm sm:text-base">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              {(isFreeNavigation && currentQuestion > 1) && (
                <button
                  className={'border dark:border-none dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-300 text-inherit font-semibold py-1 px-4 rounded-full inline-flex items-center'}
                  onClick={() => handleQuestionChange(currentQuestion - 1)}
                >
                  <ArrowLeft className="mr-2"/>
                  <span className="text-sm sm:text-base">Atrás</span>
                </button>
              )}
              {(!isFreeNavigation || currentQuestion === 1) && <div></div>}
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
      <Toaster/>
    </div>
  )
}
