'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Menu, X, Clock, Award, BookCheck } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import HeaderSimulator from '@/components/(Landing-page)/simulator/HeaderSimulator'
import { useExitFinishToastReview } from "@/hooks/useExitFinishToastReview"
import QuestionEditor from "@/components/(Landing-page)/simulator/QuestionEditor"
import OptionEditor from "@/components/(Landing-page)/simulator/OptionEditor"
import JustificationEditor from "@/components/(Landing-page)/simulator/JustificationEditor"

interface SimulatorExamProps {
  simulatorId: string;
}

interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
  isCorrect: boolean
}

interface Category {
  id: number
  name: string
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
  options: Option[]
  category: Category
  simulatorId?: string
}

interface ExamData {
  simulatorId: string
  simulatorName: string
  questions: Question[]
  userAnswers: { [key: number]: number | null }
  timeSpent: number
  fullName: string
  email: string
  score: number
  totalQuestions: number
  totalAnswered: number
  percentageAnswered: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
}

export default function ExamReview({ simulatorId }: SimulatorExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [examData, setExamData] = useState<ExamData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedExamData = localStorage.getItem('examData')
    if (savedExamData) {
      const parsedExamData = JSON.parse(savedExamData)
      if (parsedExamData.simulatorId === simulatorId) {
        setExamData(parsedExamData)
      } else {
        router.replace('/simulator')
      }
    } else {
      router.replace('/simulator')
    }
  }, [router, simulatorId])

  const totalQuestions = examData?.totalQuestions || 0

  const handleQuestionChange = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
      setSideMenuOpen(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours > 0 ? `${hours}h ` : ''}${minutes} min`
  }

  const { showExitFinishToastReview } = useExitFinishToastReview(simulatorId);

  const isQuestionAnsweredCorrectly = (question: Question, userAnswer: number | null) => {
    if (userAnswer === null) return false;
    if (question.options.length === 1) {
      // Para preguntas de una sola opción, se considera correcta si se respondió
      return true;
    }
    const selectedOption = question.options.find(opt => opt.id === userAnswer);
    return selectedOption ? selectedOption.isCorrect : false;
  }

  const isQuestionAnswered = (userAnswer: number | null) => {
    return userAnswer !== null && userAnswer !== undefined;
  }

  const getQuestionStatus = (question: Question, userAnswer: number | null) => {
    if (!isQuestionAnswered(userAnswer)) {
      return {
        status: 'unanswered',
        color: 'bg-orange-300 dark:bg-orange-600'
      };
    }

    return isQuestionAnsweredCorrectly(question, userAnswer)
      ? {
        status: 'correct',
        color: 'bg-green-300 dark:bg-green-600'
      }
      : {
        status: 'incorrect',
        color: 'bg-red-300 dark:bg-red-600'
      };
  }

  const getOptionBackgroundColor = (option: Option, userAnswer: number | null) => {
    if (option.isCorrect) {
      return 'bg-green-100 dark:bg-green-800';
    }
    if (option.id === userAnswer && !option.isCorrect) {
      return 'bg-red-100 dark:bg-red-800';
    }
    return '';
  }

  const getAnswerLetter = (options: Option[], answerId: number | null) => {
    if (answerId === null || answerId === undefined) return 'Sin respuesta';
    const index = options.findIndex(opt => opt.id === answerId);
    return index !== -1 ? `Opción ${String.fromCharCode(65 + index)}` : 'Opción no encontrada';
  }

  const QuestionGrid = () => (
    <div className="dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow">
      <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-2 text-center flex items-center justify-center dark:text-white text-gray-800">
        <BookCheck className="w-5 h-5 lg:w-6 lg:h-6 text-blue-700 dark:text-blue-400 mr-2"/>
        Revisión del Examen
      </h2>
      <p className="text-sm text-center mb-2 dark:text-gray-400">
        Tiempo empleado: {examData ? formatTime(examData.timeSpent) : 'N/A'}
      </p>
      <p className="text-sm text-center mb-4 dark:text-gray-400">
        Tu calificación: {examData ? `${examData.score.toFixed(2)}/100` : 'N/A'}
      </p>
      <div className="grid grid-cols-9 md:grid-cols-12 lg:grid-cols-9 gap-1">
        {examData?.questions.map((question, index) => {
          const userAnswer = examData?.userAnswers[question.id];
          const status = getQuestionStatus(question, userAnswer);

          return (
            <button
              key={question.id}
              className={`w-6 h-6 sm:w-8 sm:h-8 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-110 ${status.color} ${
                index === currentQuestionIndex ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              } text-gray-800 dark:text-white`}
              onClick={() => handleQuestionChange(index)}
            >
              {(index + 1).toString().padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )

  const handleExitOrFinish = () => {
    const action = currentQuestionIndex === totalQuestions - 1 ? 'finalizar' : 'salir'
    showExitFinishToastReview(action)
  }

  const currentQuestionData = examData?.questions[currentQuestionIndex]
  const userAnswer = currentQuestionData ? examData?.userAnswers[currentQuestionData.id] : null

  if (!examData || !currentQuestionData) {
    return <div>Cargando datos del examen...</div>
  }

  return (
    <div className={'select-none min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden'}>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 dark:opacity-5 responsive-background" />
      <HeaderSimulator
        simulatorName={examData.simulatorName}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onExitOrFinish={handleExitOrFinish}
      />

      <main className="container mx-auto px-2 pb-20 flex-grow relative z-10">
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 lg:h-5 lg:w-5 text-blue-700 dark:text-blue-400 mr-1"/>
                  <span className="text-sm font-normal">{formatTime(examData.timeSpent)}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 lg:h-5 lg:w-5 text-blue-700 dark:text-blue-400 mr-1"/>
                  <span className="text-sm font-normal">{examData.score.toFixed(2)}/100</span>
                </div>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-4 rounded-lg shadow mb-4'}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3 className="text-base md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-0 order-1 sm:order-2 dark:text-gray-400">
                  {currentQuestionData.category.name}
                </h3>
                <div className="order-2 sm:order-1">
                  <h2 className="text-sm lg:text-xl md:text-lg font-bold dark:text-gray-300">Pregunta {currentQuestionIndex + 1}</h2>
                </div>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow mb-4'}>
              <QuestionEditor
                question={currentQuestionData}
                key={`question-${currentQuestionData.id}`}
              />
              <div className="w-full flex items-center pb-5">
                <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
              </div>
              <div className="space-y-2">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`rounded ${getOptionBackgroundColor(option, userAnswer)}`}
                  >
                    <OptionEditor
                      option={option}
                      index={index}
                      isSelected={userAnswer === option.id || option.isCorrect}
                      onSelect={() => {}}
                      isReviewMode={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow mb-4'}>
              <h4 className="text-base md:text-base lg:text-lg font-semibold mb-4 dark:text-gray-300">Resumen de respuestas</h4>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm dark:text-gray-300">Tu respuesta:</span>
                  <span className={`text-sm ${
                    isQuestionAnsweredCorrectly(currentQuestionData, userAnswer)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {getAnswerLetter(currentQuestionData.options, userAnswer)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm dark:text-gray-300">Respuesta correcta:</span>
                  <span className="text-green-500 text-sm">
                    {getAnswerLetter(currentQuestionData.options, currentQuestionData.options.find(opt => opt.isCorrect)?.id ?? null)}
                  </span>
                </div>
              </div>
            </div>

            <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
              <h4  className="text-base md:text-base lg:text-lg font-semibold mb-4 dark:text-gray-300">Justificación</h4>
              {currentQuestionData.justification ? (
                <JustificationEditor
                  justification={currentQuestionData.justification}
                  questionId={currentQuestionData.id}
                  key={`justification-${currentQuestionData.id}`}
                />
              ) : (
                <p className="text-sm md:text-base lg:text-base dark:text-gray-400">
                  Pregunta sin justificación
                </p>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className={'border dark:border-none dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-300 text-inherit font-semibold py-1 px-4 rounded-full inline-flex items-center'}
                onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2"/>
                <span className="text-sm sm:text-base">Anterior</span>
              </button>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-full inline-flex items-center"
                  onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                >
                  <span className="text-sm sm:text-base">Siguiente</span>
                  <ArrowRight className="ml-2"/>
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-1  px-4 rounded-full inline-flex items-center"
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
