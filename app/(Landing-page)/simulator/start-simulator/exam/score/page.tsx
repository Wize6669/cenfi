'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ThemeToggle } from "@/components/ThemeToggle"
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
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
  const router = useRouter()

  useEffect(() => {
    const examData = localStorage.getItem('examData')
    if (examData) {
      const { questions, userAnswers } = JSON.parse(examData)
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

      if (correct === total) {
        setShowConfetti(true)
      }
    }
    setReviewAvailable(localStorage.getItem('reviewAvailable') === 'true')

    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  const handleReview = () => {
    router.push('/simulator/start-simulator/exam/review')
  }

  const handleNewAttempt = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    router.push('/simulator/')
  }

  const handleExit = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    router.push('/')
  }

  const percentage = score !== null ? (score / totalQuestions) * 100 : 0

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
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Image src="/images/image-1.png" alt="CENFI Logo" width={90} height={85} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block">Simuladores Preuniversitario CENFI</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/image-1.png"
              alt="CENFI Logo"
              width={300}
              height={100}
              className="h-40 w-auto filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)]"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-blue-400">Resultados del
            Examen</h2>
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">Número total de preguntas:</span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</span>
            </div>
          </div>
          {score !== null && (
            <>
              <div className="mb-8">
              <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span
                        className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Progreso
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{width: `${percentage}%`}}
                         className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-semibold">Correctas</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-300">{correctAnswers}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500"/>
                </div>
                <div className="bg-red-100 dark:bg-red-800 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-semibold">Incorrectas</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-300">{incorrectAnswers}</p>
                  </div>
                  <XCircle className="h-12 w-12 text-red-500"/>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold">Sin responder</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{unanswered}</p>
                  </div>
                  <AlertCircle className="h-12 w-12 text-yellow-500"/>
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {reviewAvailable && (
                  <button
                    onClick={handleReview}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
                  >
                    Revisar Intento
                  </button>
                )}
                <button
                  onClick={handleNewAttempt}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
                >
                  Nuevo Intento
                </button>
                <button
                  onClick={handleExit}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
                >
                  Salir
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
