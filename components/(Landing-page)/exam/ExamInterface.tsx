'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {ArrowLeft, ArrowRight, Clock, Flag, Menu, Trash2, X} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import {redirect, useRouter} from 'next/navigation'
import HeaderSimulator from '@/components/(Landing-page)/simulator/HeaderSimulator'
import {useExitFinishToast} from '@/hooks/useExitFinishToast'
import {useFiveMinuteWarning} from '@/hooks/useFiveMinuteWarning'
import {useUserStore} from '@/store/userStore'
import OptionEditor from '@/components/(Landing-page)/simulator/OptionEditor'
import QuestionEditor from "@/components/(Landing-page)/simulator/QuestionEditor"
import {axiosInstance} from "@/lib/axios";

interface SimulatorExamProps {
  simulatorId: string;
}

interface Category {
  id: number
  name: string
}

interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
  isCorrect: boolean
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

interface Simulator {
  id: string;
  name: string;
  duration: number;
  navigate: boolean;
  visibility: boolean;
  review: boolean;
  number_of_questions: number;
  questions?: Question[];
}

export default function ExamInterface({ simulatorId }: SimulatorExamProps) {
  const [simulator, setSimulator] = useState<Simulator | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({})
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [fiveMinWarningShown, setFiveMinWarningShown] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [contentKey, setContentKey] = useState(0)
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([])
  const [isDataReady, setIsDataReady] = useState<boolean>(false)

  const router = useRouter()
  const { userSimulator } = useUserStore()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const currentSimulatorId = localStorage.getItem('currentSimulatorId');

    if (!authToken || currentSimulatorId !== simulatorId) {
      redirect(`/simulator/${simulatorId}`);
    }
  }, [simulatorId]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const randomizeQuestionsByCategory = useCallback((questions: Question[]): Question[] => {
    // Agrupar preguntas por categoría
    const questionsByCategory: { [key: number]: Question[] } = {}
    questions.forEach(question => {
      if (!questionsByCategory[question.category.id]) {
        questionsByCategory[question.category.id] = []
      }
      questionsByCategory[question.category.id].push(question)
    })

    // Aleatorizar preguntas dentro de cada categoría y aleatorizar opciones
    Object.keys(questionsByCategory).forEach(categoryId => {
      questionsByCategory[Number(categoryId)] = shuffleArray(questionsByCategory[Number(categoryId)]).map(question => ({
        ...question,
        options: shuffleArray(question.options)
      }))
    })

    // Aleatorizar el orden de las categorías
    const randomizedCategoryIds = shuffleArray(Object.keys(questionsByCategory))

    // Combinar todas las preguntas aleatorizadas
    return randomizedCategoryIds.flatMap(categoryId =>
      questionsByCategory[Number(categoryId)]
    )
  }, [])

  const fetchSimulator = useCallback(async () => {
    try {
      setLoading(true)
      setIsDataReady(false)
      const simulatorId = localStorage.getItem('currentSimulatorId')
      if (!simulatorId) {
        console.error('No se encontró el ID del simulador')
        redirect('/');
      }

      const response = await axiosInstance.get<Simulator>(`/simulators/${simulatorId}`)
      console.log('Simulator data:', response.data)

      const randomizedQuestions = randomizeQuestionsByCategory(response.data.questions || [])

      setSimulator({
        ...response.data,
        questions: randomizedQuestions
      })

      setRandomizedQuestions(randomizedQuestions)
      setTimeRemaining(response.data.duration * 60)
      setLoading(false)
      setIsDataReady(true)
    } catch (err) {
      setError('Error al cargar el simulador')
      console.error('Error fetching simulator:', err)
      setLoading(false)
    }
  }, [randomizeQuestionsByCategory])

  useEffect(() => {
    fetchSimulator()
      .then(() => {
        console.log('Datos cargadas correctamente.');
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [fetchSimulator])

  const handleExit = () => {
    console.log("Saliendo del examen")
  }

  const totalQuestions = simulator?.questions?.length || 0

  const calculateScore = useCallback(() => {
    if (!simulator?.questions) return 0;

    let correctAnswers = 0;
    simulator.questions.forEach((question) => {
      const selectedOptionId = selectedOptions[question.id];
      if (selectedOptionId !== undefined && selectedOptionId !== null) {
        const selectedOption = question.options.find(option => option.id === selectedOptionId);
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
        }
      }
    });

    return (correctAnswers / totalQuestions) * 100;
  }, [simulator?.questions, selectedOptions, totalQuestions]);

  const saveExamData = useCallback(() => {
    if (!simulator) return;

    const totalAnswered = randomizedQuestions.reduce((count, question) => {
      return selectedOptions[question.id] !== undefined ? count + 1 : count
    }, 0)

    const percentageAnswered = (totalAnswered / totalQuestions) * 100
    const score = calculateScore()

    const examData = {
      simulatorId: simulator.id,
      simulatorName: simulator.name,
      questions: randomizedQuestions,
      review: simulator.review,
      userAnswers: selectedOptions,
      timeSpent: simulator.duration * 60 - timeRemaining,
      fullName: userSimulator.fullName,
      email: userSimulator.email,
      score: score,
      lastAnsweredQuestion: currentQuestionIndex + 1,
      totalQuestions: totalQuestions,
      totalAnswered: totalAnswered,
      percentageAnswered: percentageAnswered,
      correctAnswers: Math.round((score * totalQuestions) / 100),
      incorrectAnswers: totalAnswered - Math.round((score * totalQuestions) / 100),
      unansweredQuestions: totalQuestions - totalAnswered
    }
    localStorage.setItem('examData', JSON.stringify(examData))

    const allowReview = simulator.review && percentageAnswered > 90
    localStorage.setItem('reviewAvailable', allowReview.toString())

    router.replace(`/simulator/${simulatorId}/score`)
  }, [simulator, randomizedQuestions, selectedOptions, timeRemaining, router, calculateScore, userSimulator.fullName, userSimulator.email, currentQuestionIndex, totalQuestions, simulatorId])

  const { showExitFinishToast } = useExitFinishToast(simulatorId, handleExit, saveExamData)
  const { showFiveMinuteWarning } = useFiveMinuteWarning(userSimulator.fullName ?? 'Usuario')

  useEffect(() => {
    if (!simulator) return;

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
  }, [simulator, fiveMinWarningShown, showFiveMinuteWarning, saveExamData])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleMarkQuestion = () => {
    if (simulator?.navigate) {
      setMarkedQuestions((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(currentQuestionIndex)) {
          newSet.delete(currentQuestionIndex)
        } else {
          newSet.add(currentQuestionIndex)
        }
        return newSet
      })
    }
  }

  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }))
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex))
  }

  const handleClearAnswer = (questionId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: null }))
    setAnsweredQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentQuestionIndex)
      return newSet
    })
  }

  const handleQuestionChange = (num: number) => {
    if (simulator?.navigate || num === currentQuestionIndex + 2) {
      setContentKey(prevKey => prevKey + 1)
      setCurrentQuestionIndex(num - 1)
      setSideMenuOpen(false)
    }
  }

  const handleExitOrFinish = () => {
    const action = currentQuestionIndex === totalQuestions - 1 ? 'finalizar' : 'salir'
    showExitFinishToast(action)
  }


  const QuestionGrid = () => (
    <div className="dark:bg-gray-800 bg-gray-50 p-3 rounded-lg shadow">
      <h2 className="text-base md:text-lg lg:text-lg font-semibold mb-5 mt-2 text-center flex items-center justify-center dark:text-white text-gray-800">
        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-700 dark:text-blue-400 mr-2" />
        Tiempo restante: <span className={'font-normal pl-2'}> {formatTime(timeRemaining)}</span>
      </h2>
      <div className="grid grid-cols-9 md:grid-cols-12 lg:grid-cols-9 gap-1">
        {simulator?.questions?.map((_, index) => (
          <button
            key={index}
            className={`w-6 h-6 sm:w-8 sm:h-8 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-110 ${
              index === currentQuestionIndex
                ? 'bg-sky-300 text-gray-800'
                : markedQuestions.has(index)
                  ? 'bg-orange-300 text-gray-800'
                  : answeredQuestions.has(index)
                    ? 'bg-green-300 text-gray-800'
                    : 'border dark:border-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            } ${!simulator.navigate && index !== currentQuestionIndex + 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleQuestionChange(index + 1)}
            disabled={!simulator.navigate && index !== currentQuestionIndex + 1}
          >
            {(index + 1).toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )

  if (loading || !isDataReady) {
    return <div>Cargando simulador...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!simulator || !randomizedQuestions || randomizedQuestions.length === 0) {
    return <div>No hay preguntas disponibles para este simulador.</div>
  }

  const currentQuestionData = simulator?.questions?.[currentQuestionIndex]

  return (
    <div className={'select-none pb-12 min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden'}>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 dark:opacity-5 responsive-background" />
      <HeaderSimulator
        simulatorName={simulator.name}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={randomizedQuestions.length}
        onExitOrFinish={handleExitOrFinish}
      />
      <main className="container mx-auto px-2 pb-2 flex-grow relative z-10">
        <div className="flex flex-col space-y-2 sm:flex-row  sm:space-y-0 sm:space-x-4 justify-end pb-2">
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
                      {currentQuestionData.category.name}
                    </h3>
                    <div className="order-2 sm:order-1">
                      <h2 className="pb-1 text-sm lg:text-xl md:text-lg font-bold  dark:text-gray-300">Pregunta {currentQuestionIndex + 1}</h2>
                      <p className={`text-sm md:text-base lg:text-base ${answeredQuestions.has(currentQuestionIndex)   ? 'text-green-500' : 'text-gray-400'}`}>
                        {answeredQuestions.has(currentQuestionIndex) ? 'Pregunta contestada' : 'Sin responder aún'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between mt-2">
                    {simulator.navigate && (
                      <label className={`flex items-center cursor-pointer  dark:text-gray-400    ${markedQuestions.has(currentQuestionIndex) ? 'dark:text-orange-500 text-orange-500' : ''} `}>
                        <input
                          type="checkbox"
                          checked={markedQuestions.has(currentQuestionIndex)}
                          onChange={handleMarkQuestion}
                          className="hidden"
                        />
                        <Flag  className={`mr-2 h-4 w-4 ${markedQuestions.has(currentQuestionIndex) ? 'text-orange-500' : 'text-gray-400'}`}/>
                        <span className="text-sm md:text-base lg:text-base">Marcar pregunta</span>
                      </label>
                    )}
                    {selectedOptions[currentQuestionData.id] !== null && selectedOptions[currentQuestionData.id] !== undefined && (
                      <button
                        onClick={() => handleClearAnswer(currentQuestionData.id)}
                        className="flex items-center text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span className="text-sm md:text-base lg:text-base">Borrar selección</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className={'dark:bg-gray-800 bg-gray-50 p-6 rounded-lg shadow'}>
                  <QuestionEditor
                    key={`question-${contentKey}-${currentQuestionData.id}`}
                    question={currentQuestionData}
                  />
                  <div className="w-full flex items-center pb-5">
                    <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
                  </div>
                  <div className="space-y-2">
                    {currentQuestionData.options?.map((option, index) => (
                      <OptionEditor
                        key={`option-${contentKey}-${option.id}`}
                        option={option}
                        index={index}
                        isSelected={selectedOptions[currentQuestionData.id] === option.id}
                        onSelect={() => handleAnswerSelect(currentQuestionData.id, option.id)}
                        isReviewMode={false}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  {(simulator.navigate && currentQuestionIndex > 0) && (
                    <button
                      className={'border dark:border-none dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-300 text-inherit font-semibold py-1 px-4 rounded-full inline-flex items-center'}
                      onClick={() => handleQuestionChange(currentQuestionIndex)}
                    >
                      <ArrowLeft className="mr-2"/>
                      <span className="text-sm sm:text-base">Atrás</span>
                    </button>
                  )}
                  {(!simulator.navigate || currentQuestionIndex === 0) && <div></div>}
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-full inline-flex items-center"
                    onClick={() => {
                      if (currentQuestionIndex < totalQuestions - 1) {
                        handleQuestionChange(currentQuestionIndex + 2)
                      } else {
                        handleExitOrFinish()
                      }
                    }}
                  >
                    <span className="text-sm sm:text-base">
                      {currentQuestionIndex < totalQuestions - 1 ? 'Siguiente' : 'Finalizar'}
                    </span>
                    {currentQuestionIndex < totalQuestions - 1 && <ArrowRight className="ml-2"/>}
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
