'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Menu, X, Clock, CheckCircle, XCircle, Award, BookCheck } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import HeaderSimulator from '@/components/(Landing-page)/simulator/HeaderSimulator'
import { useExitFinishToastReview } from "@/hooks/useExitFinishToastReview";

interface Question {
  id: number
  title: string
  content: string
  options: string[]
  section: string
  correctAnswer: string
  justification?: string
}

interface ExamData {
  questions: Question[]
  userAnswers: { [key: number]: string | null }
  timeSpent: number
  fullName: string
  email: string
  score: number
}

export default function ExamReview() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1)
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [examData, setExamData] = useState<ExamData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedExamData = localStorage.getItem('examData')
    if (savedExamData) {
      setExamData(JSON.parse(savedExamData))
    } else {
      router.replace('/simulator/start-simulator/exam/score')
    }
  }, [router])

  const totalQuestions = examData?.questions.length || 0

  const handleQuestionChange = (num: number) => {
    if (num >= 1 && num <= totalQuestions) {
      setCurrentQuestion(num)
      setSideMenuOpen(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours > 0 ? `${hours}h ` : ''}${minutes} min`
  }

  const { showExitFinishToastReview } = useExitFinishToastReview();

  const handleExit = () => {
    toast((t) => (
      <div>
        <p>¿Estás seguro de que quieres salir?</p>
        <p>Una vez que salgas, no podrás volver a ingresar a la revisión.</p>
        <div className="mt-4">
          <button
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              localStorage.removeItem('examData')
              localStorage.removeItem('reviewAvailable')
              toast.dismiss(t.id)
              router.push('/')
            }}
          >
            Sí, salir
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: Infinity })
  }

  const QuestionGrid = () => (
    <div className="dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow">
      <h2
        className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-center flex items-center justify-center dark:text-white text-gray-800">
        <BookCheck className="mr-2"/>
        Revisión del Examen
      </h2>
      <p className="text-sm text-center mb-2 dark:text-gray-400">
        Tiempo empleado: {examData ? formatTime(examData.timeSpent) : 'N/A'}
      </p>
      <p className="text-sm text-center mb-4 dark:text-gray-400">
        Tu calificación: {examData ? `${examData.score.toFixed(2)}/100` : 'N/A'}
      </p>
      <div className="grid grid-cols-9 md:grid-cols-12 lg:grid-cols-9 gap-1">
        {Array.from({length: totalQuestions}, (_, i) => i + 1).map((num) => {
          const question = examData?.questions[num - 1]
          const userAnswer = examData?.userAnswers[num]
          const isCorrect = userAnswer === question?.correctAnswer

          return (
            <button
              key={num}
              className={`w-6 h-6 sm:w-8 sm:h-8 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-110 ${
                num === currentQuestion
                  ? 'bg-sky-300 text-gray-800'
                  : userAnswer
                    ? isCorrect
                      ? 'bg-green-300 text-gray-800'
                      : 'bg-red-300 text-gray-800'
                    : 'border dark:border-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
              onClick={() => handleQuestionChange(num)}
            >
              {num.toString().padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )

  const handleExitOrFinish = () => {
    const action = currentQuestion === totalQuestions ? 'finalizar' : 'salir'
    showExitFinishToastReview(action)
  }

  const currentQuestionData = examData?.questions[currentQuestion - 1]
  const userAnswer = examData?.userAnswers[currentQuestion]

  if (!examData || !currentQuestionData) {
    return <div>Cargando datos del examen...</div>
  }

  return (
    <div
      className={'min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'}>
      <HeaderSimulator
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onExitOrFinish={handleExitOrFinish}
      />

      <main className="container mx-auto px-2 pb-20 flex-grow">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-end pb-2">
          <span className="text-xs sm:text-sm md:text-base dark:text-gray-400">
            <span className="font-bold dark:text-gray-300">Usuario: </span>{examData.email}
          </span>
          <span className="text-xs sm:text-sm md:text-base dark:text-gray-400">
            <span className="font-bold dark:text-gray-300">Nombre: </span> {examData.fullName}
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span className="text-sm">{formatTime(examData.timeSpent)}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-1" />
                  <span className="text-sm">{examData.score.toFixed(2)}/100</span>
                </div>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-4 rounded-lg shadow mb-4'}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3
                  className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-0 order-1 sm:order-2 dark:text-gray-400">
                  {currentQuestionData.section}
                </h3>
                <div className="order-2 sm:order-1">
                  <h2
                    className="text-lg sm:text-base md:text-xl font-bold dark:text-gray-300">Pregunta {currentQuestion}</h2>
                </div>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow mb-4'}>
              <p className="mb-6 text-sm sm:text-base md:text-lg dark:text-gray-400">{currentQuestionData.content}</p>
              <div className="w-full flex items-center pb-5">
                <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
              </div>
              <div className="space-y-2">
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className={`flex items-center p-2 rounded ${
                    option === currentQuestionData.correctAnswer
                      ? 'bg-green-100 dark:bg-green-800'
                      : option === userAnswer && option !== currentQuestionData.correctAnswer
                        ? 'bg-red-100 dark:bg-red-800'
                        : ''
                  }`}>
                    <span className="text-sm sm:text-base mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-sm sm:text-base">{option}</span>
                    {option === currentQuestionData.correctAnswer && (
                      <CheckCircle className="ml-2 text-green-500"/>
                    )}
                    {option === userAnswer && option !== currentQuestionData.correctAnswer && (
                      <XCircle className="ml-2 text-red-500"/>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
              <h4 className="text-lg font-semibold mb-4 dark:text-gray-300">Respuesta Correcta</h4>
              <p
                className="mb-4 text-sm sm:text-base md:text-lg dark:text-gray-400">{currentQuestionData.correctAnswer}</p>
              <h4 className="text-lg font-semibold mb-4 dark:text-gray-300">Tu Respuesta</h4>
              <p className="mb-4 text-sm sm:text-base md:text-lg dark:text-gray-400">
                {userAnswer || 'No respondida'}
              </p>
              <h4 className="text-lg font-semibold mb-4 dark:text-gray-300">Justificación</h4>
              <p className="text-sm sm:text-base md:text-lg dark:text-gray-400">
                {currentQuestionData.justification || 'Pregunta sin justificación'}
              </p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className={'border dark:border-none dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-300 text-inherit font-semibold py-1 px-4 rounded-full inline-flex items-center'}
                onClick={() => handleQuestionChange(currentQuestion - 1)}
                disabled={currentQuestion === 1}
              >
                <ArrowLeft className="mr-2"/>
                <span className="text-sm sm:text-base">Anterior</span>
              </button>
              {currentQuestion < totalQuestions ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-full inline-flex items-center"
                  onClick={() => handleQuestionChange(currentQuestion + 1)}
                >
                  <span className="text-sm sm:text-base">Siguiente</span>
                  <ArrowRight className="ml-2"/>
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-full inline-flex items-center"
                  onClick={handleExitOrFinish}
                >
                  <span className="text-sm sm:text-base">Finalizar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Toaster/>
    </div>
  )
}