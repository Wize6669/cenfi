'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from "@/components/Footer"
import Image from 'next/image'
import {ThemeToggle} from "@/components/ThemeToggle";
import {LogOut} from "lucide-react";

export default function ExamScore() {
  const [score, setScore] = useState<number | null>(null)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [reviewAvailable, setReviewAvailable] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const examData = localStorage.getItem('examData')
    if (examData) {
      const { questions, userAnswers } = JSON.parse(examData)
      const correctAnswers = questions.filter((q: any, index: number) =>
        q.correctAnswer === userAnswers[index + 1] && userAnswers[index + 1] !== null
      ).length
      setScore(correctAnswers)
      setTotalQuestions(questions.length)
    }
    setReviewAvailable(localStorage.getItem('reviewAvailable') === 'true')
  }, [])

  const handleReview = () => {
    router.push('/simulator/start-simulator/exam/review')
  }

  const handleNewAttempt = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    router.push('/simulator/start-simulator')
  }

  const handleExit = () => {
    localStorage.removeItem('examData')
    localStorage.removeItem('reviewAvailable')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className={'dark:bg-gray-900 bg-gray-100 p-4'}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between sm:justify-center">
            <div className="flex items-center sm:justify-start">
              <Image className="sm:justify-start" src="/images/image-1.png" alt="CENFI Logo" width={90} height={85}/>
            </div>
            <div className="flex-grow ml-4 hidden sm:block">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex justify-center dark:text-gray-400 text-blue-900">
                Simuladores Preuniversitario CENFI
              </h1>
              <h2
                className="text-sm sm:text-base md:text-lg lg:text-2xl font-medium flex justify-center mt-3 dark:text-gray-400 pb-3">
                Simulador Universidad Nacional de Loja
              </h2>
            </div>
            <div className="sm:flex-grow-0 sm:justify-end">
              <ThemeToggle/>
            </div>
          </div>
          <div className="w-full row-start-2 content-center justify-items-center">
            <div className={'border-t-2 container dark:border-gray-700 border-gray-300'}/>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/image-1.png?height=80&width=240"
              alt="CENFI Logo"
              width={240}
              height={80}
              className="h-20 w-auto"
            />
          </div>
          {score !== null && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
                Tu puntaje final es de
              </h2>
              <p className="text-4xl font-bold text-center mb-8 dark:text-white">
                {score}/{totalQuestions}
              </p>
              <div className="flex flex-col space-y-4">
                {reviewAvailable && (
                  <button
                    onClick={handleReview}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    Revisar Intento
                  </button>
                )}
                <button
                  onClick={handleNewAttempt}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Nuevo Intento
                </button>
                <button
                  onClick={handleExit}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Salir
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  )
}
