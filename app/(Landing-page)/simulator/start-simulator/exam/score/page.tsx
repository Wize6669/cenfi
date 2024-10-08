'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ThemeToggle } from "@/components/ThemeToggle"
import { CheckCircle, XCircle, AlertCircle, BarChart2, Clock, Info, ChartArea } from 'lucide-react'
import Confetti from 'react-confetti'

export default function ExamScore() {
  const [score, setScore] = useState<number | null>(null)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [reviewAvailable, setReviewAvailable] = useState<boolean>(false)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0)
  const [unanswered, setUnanswered] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [timeSpent, setTimeSpent] = useState<number>(0)
  const [percentageAnswered, setPercentageAnswered] = useState<number>(0)
  const [hasReviewed, setHasReviewed] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const examData = localStorage.getItem('examData')
    const reviewedStatus = localStorage.getItem('hasReviewed')

    if (examData) {
      const {
        questions,
        userAnswers,
        timeSpent,
        percentageAnswered
      } = JSON.parse(examData)

      const correct = questions.filter((q: any, index: number) =>
        q.correctAnswer === userAnswers[index + 1] && userAnswers[index + 1] !== null
      ).length
      const total = questions.length
      const notAnswered = questions.filter((_: any, index: number) =>
        userAnswers[index + 1] === null || userAnswers[index + 1] === undefined
      ).length
      const incorrect = questions.filter((q: any, index: number) =>
        userAnswers[index + 1] !== null && userAnswers[index + 1] !== undefined && userAnswers[index + 1] !== q.correctAnswer
      ).length

      setScore(correct)
      setTotalQuestions(total)
      setCorrectAnswers(correct)
      setIncorrectAnswers(incorrect)
      setUnanswered(notAnswered)
      setTimeSpent(timeSpent)
      setPercentageAnswered(percentageAnswered)

      if (correct === total) {
        setShowConfetti(true)
      }

      const canReview = percentageAnswered > 10 && !reviewedStatus
      setReviewAvailable(canReview)
    }

    setHasReviewed(reviewedStatus === 'true')

    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  const handleReview = () => {
    localStorage.setItem('hasReviewed', 'true')
    setHasReviewed(true)
    router.push('/simulator/start-simulator/exam/review')
  }

  const handleNewAttempt = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    localStorage.removeItem('hasReviewed')
    router.push('/simulator/')
  }

  const handleExit = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    localStorage.removeItem('hasReviewed')
    router.push('/')
  }

  const percentage = score !== null ? (score / totalQuestions) * 100 : 0

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    if (minutes % 60 === 0 && minutes >= 60) {
      return `${minutes} min`
    }
    return `${minutes} min`
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <header className="select-none bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={handleExit}>
            <Image src="/images/image-1.png" alt="CENFI Logo" width={90} height={85}/>
          </button>
          <h1 className="md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block">Simuladores Preuniversitario CENFI</h1>
          <h1 className="text-base font-bold text-gray-800 dark:text-blue-300 lg:hidden md:hidden">SIMULADORES CENFI</h1>
          <ThemeToggle/>
        </div>
      </header>
      <main className="select-none flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/image-1.png"
              alt="CENFI Logo"
              width={200}
              height={67}
              className="h-24 w-auto filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)]"
            />
          </div>
          <h2 className="text-base md:text-lg lg:text-2xl font-bold text-center mb-6 text-gray-800 dark:text-blue-400">Resultados del Simulador</h2>

          <div className="mb-6 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg shadow-inner">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-blue-300" />
              <div className={'flex flex-row space-x-3'}>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">Tiempo empleado:</h3>
                <p className="text-sm md:text-base lg:text-xl font-bold text-blue-600 dark:text-blue-400">{formatTime(timeSpent)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm md:text-base lg:text-base font-semibold text-gray-700 dark:text-gray-300">Progreso</span>
              <span className="text-sm md:text-base lg:text-base font-bold text-blue-600 dark:text-blue-400">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-base md:text-base lg:text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                    Correctas
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">{correctAnswers}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                    <XCircle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                    Incorrectas
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">{incorrectAnswers}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500 dark:text-yellow-400" />
                    Sin responder
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{unanswered}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Total de preguntas</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{totalQuestions}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-base md:text-base lg:text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                <ChartArea className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Gráfico
              </h3>
              <div className="flex items-end h-36 space-x-2">
                <div className="flex-1 bg-green-500 dark:bg-green-600 rounded-t-lg relative group" style={{ height: `${(correctAnswers / totalQuestions) * 100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                    {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex-1 bg-red-500 dark:bg-red-600 rounded-t-lg relative group" style={{ height: `${(incorrectAnswers / totalQuestions) * 100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                    {((incorrectAnswers / totalQuestions) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex-1 bg-yellow-500 dark:bg-yellow-600 rounded-t-lg relative group" style={{ height: `${(unanswered / totalQuestions) * 100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                    {((unanswered / totalQuestions) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Correctas
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Incorrectas
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  Sin responder
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {reviewAvailable ? (
              <button
                onClick={handleReview}
                className="text-sm md:text-base lg:text-base bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
              >
                Revisar Intento
              </button>
            ) : percentageAnswered <= 10 && !hasReviewed ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex items-start space-x-3 flex-1">
                <Info className="flex-shrink-0 h-5 w-5 text-yellow-500" />
                <p className="text-sm">
                  La revisión no está disponible porque no se respondió suficientes preguntas.
                </p>
              </div>
            ) : null}
            <button
              onClick={handleNewAttempt}
              className="text-sm md:text-base lg:text-base bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
            >
              Nuevo Intento
            </button>
            <button
              onClick={handleExit}
              className="text-sm md:text-base lg:text-base bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
            >
              Salir
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
