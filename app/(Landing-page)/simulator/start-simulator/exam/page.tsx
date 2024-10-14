'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Menu, X, Flag, Trash2, Clock } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import HeaderSimulator from '@/components/(Landing-page)/simulator/HeaderSimulator'
import { useExitFinishToast } from '@/hooks/useExitFinishToast'
import { useFiveMinuteWarning } from '@/hooks/useFiveMinuteWarning'
import { useUserStore } from '@/store/userStore'
import OptionEditor from '@/components/(Landing-page)/simulator/OptionEditor'
import QuestionEditor from "@/components/(Landing-page)/simulator/QuestionEditor"
import {config} from "@/config";

interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
}

interface Question {
  id: number
  content: {
    type: string
    content: any[]
  }
  justification?: {
    type: string
    content: any[]
  }
  answer: number
  options: Option[]
  categoryId?: number
  simulatorId?: string
}

interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function ExamInterface() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(1)
  const [timeRemaining, setTimeRemaining] = useState<number>(3000)
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({})
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [fiveMinWarningShown, setFiveMinWarningShown] = useState<boolean>(false)
  const [isFreeNavigation, setIsFreeNavigation] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env


  const router = useRouter()
  const { userSimulator } = useUserStore()

  const fetchAllQuestions = useCallback(async () => {
    try {
      let allQuestions: Question[] = []
      let currentPage = 1
      let totalPages = 1

      do {
        const response = await axios.get<PaginatedResponse<Question>>(`${HOST_BACK_END}/api/v1/questions`, {
          params: {
            page: currentPage,
            count: 500
          }
        })

        allQuestions = [...allQuestions, ...response.data.data]
        currentPage++
        totalPages = response.data.totalPages
      } while (currentPage <= totalPages)

      setQuestions(allQuestions)
      setLoading(false)
    } catch (err) {
      setError('Error al cargar las preguntas')
      console.error('Error fetching questions:', err)
      setLoading(false)
    }
  }, [HOST_BACK_END])

  useEffect(() => {
    fetchAllQuestions()
  }, [fetchAllQuestions])

  const handleExit = () => {
    console.log("Saliendo del examen")
  }

  const totalQuestions = questions.length

  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedOptions[question.id] === question.answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / totalQuestions) * 100;
  }, [questions, selectedOptions, totalQuestions]);

  const saveExamData = useCallback(() => {
    const totalAnswered = Object.values(selectedOptions).filter(option => option !== null).length
    const percentageAnswered = (totalAnswered / totalQuestions) * 100

    const examData = {
      questions,
      userAnswers: selectedOptions,
      timeSpent: 3000 - timeRemaining,
      fullName: userSimulator.fullName,
      email: userSimulator.email,
      score: calculateScore(),
      lastAnsweredQuestion: currentQuestion,
      totalQuestions: totalQuestions,
      totalAnswered: totalAnswered,
      percentageAnswered: percentageAnswered
    }
    localStorage.setItem('examData', JSON.stringify(examData))

    const allowReview = percentageAnswered > 90
    localStorage.setItem('reviewAvailable', allowReview.toString())

    router.replace('/simulator/start-simulator/exam/score')
  }, [questions, selectedOptions, timeRemaining, router, calculateScore, userSimulator.fullName, userSimulator.email, currentQuestion, totalQuestions])

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

  const handleAnswerSelect = (optionId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [currentQuestion]: optionId }))
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

  const currentQuestionData = questions[currentQuestion - 1]

  const QuestionGrid = () => (
    <div className="dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow">
      <h2 className="text-base md:text-lg lg:text-lg font-semibold mb-5 mt-2 text-center flex items-center justify-center dark:text-white text-gray-800">
        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-700 dark:text-blue-400 mr-2" />
        Tiempo restante: <span className={'font-normal pl-2'}> {formatTime(timeRemaining)}</span>
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

  if (loading) {
    return <div>Cargando preguntas...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (questions.length === 0) {
    return <div>No hay preguntas disponibles.</div>
  }

  return (
    <div className={'select-none pb-12 min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden'}>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 dark:opacity-5 responsive-background" />
      <HeaderSimulator
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onExitOrFinish={handleExitOrFinish}
      />

      <main className="container mx-auto px-2 pb-2 flex-grow relative z-10">
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
                  <X className="h-4 w-4 text-blue-700 dark:text-blue-400 hover:bg-red-500"/>
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
                <Menu className="h-6 w-6 text-blue-700 dark:text-blue-400"/>
              </button>
              <div className="lg:hidden flex items-center dark:bg-gray-800 bg-gray-50 p-2 rounded-lg">
                <Clock className="mr-2 w-4 h-4 lg:h-5 lg:w-5 text-blue-700 dark:text-blue-400"/>
                <span className="text-sm font-normal">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {currentQuestionData && (
              <>
                <div className={'dark:bg-gray-800 bg-gray-50 p-4 rounded-lg shadow mb-4 '}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="text-base md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-0 order-1 sm:order-2 dark:text-gray-400">
                      Categoría {currentQuestionData.categoryId}
                    </h3>
                    <div className="order-2 sm:order-1">
                      <h2 className="pb-1 text-sm lg:text-xl md:text-lg font-bold  dark:text-gray-300">Pregunta {currentQuestion}</h2>
                      <p className={`text-sm md:text-base lg:text-base ${answeredQuestions.has(currentQuestion) ? 'text-green-500' : 'text-gray-400'}`}>
                        {answeredQuestions.has(currentQuestion) ? 'Pregunta contestada' : 'Sin responder aún'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between mt-2">
                    {isFreeNavigation && (
                      <label className={`flex items-center cursor-pointer dark:text-gray-400  ${markedQuestions.has(currentQuestion) ? 'dark:text-orange-500 text-orange-500' : ''} `}>
                        <input
                          type="checkbox"
                          checked={markedQuestions.has(currentQuestion)}
                          onChange={handleMarkQuestion}
                          className="hidden"
                        />
                        <Flag  className={`mr-2 h-4 w-4 ${markedQuestions.has(currentQuestion) ? 'text-orange-500' : 'text-gray-400'}`}/>
                        <span className="text-sm md:text-base lg:text-base">Marcar pregunta</span>
                      </label>
                    )}
                    {selectedOptions[currentQuestion] !== null && selectedOptions[currentQuestion] !== undefined && (
                      <button
                        onClick={handleClearAnswer}
                        className="flex items-center text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span className="text-sm md:text-base lg:text-base">Borrar selección</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
                  <QuestionEditor content={currentQuestionData.content} />
                  <div className="w-full flex items-center pb-5">
                    <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
                  </div>
                  <div className="space-y-2">
                    {currentQuestionData.options?.map((option, index) => (
                      <OptionEditor
                        key={option.id}
                        option={option}
                        index={index}
                        isSelected={selectedOptions[currentQuestion] === option.id}
                        onSelect={() => handleAnswerSelect(option.id)}
                      />
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
              </>
            )}
          </div>
        </div>
      </main>
      <Toaster/>
    </div>
  )
}
