'use client'

import React from 'react'
import { CalendarDays, DollarSign, BookOpen, Award, PhoneCall, HandCoins, MonitorCheck, UserPen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Course } from "@/interfaces/Course"

const CourseOffer: React.FC<{ course: Course; index: number }> = ({ course, index }) => {

  if (!course) {
    return <div>Error: Curso no disponible</div>
  }

  const formatStartDate = (date: string | Date | null) => {
    if (!date) return 'Fecha no especificada';
    let parsedDate = date instanceof Date ? date : parseISO(date);
    return format(parsedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
  }

  const formatEndDate = (date: string | Date | null) => {
    if (!date) return 'Fecha no especificada';
    let parsedDate = date instanceof Date ? date : parseISO(date);
    return format(parsedDate, 'MMMM yyyy', { locale: es });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto mb-8"
    >
      <div key={index} className="select-none bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-white">
        <h2 className="text-4xl font-bold mb-2">{course.name}</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-2xl">{course.university}</h3>
          <p className="text-lg bg-blue-700 px-4 py-2 rounded-full mt-4 md:mt-0">{course.schedule}</p>
        </div>
      </div>
      <div className="select-none p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="">
            <div className="flex items-center space-x-3 mb-2">
              <CalendarDays className="w-6 h-6 text-blue-500"/>
              <h4 className="font-semibold text-blue-900 dark:text-gray-300">Cronograma</h4>
            </div>
            <p className="mb-2">
              <span className="font-semibold text-blue-900 ml-2 px-3 py-0.5 bg-green-100 rounded-full">Inicio</span>
              <span className="ml-2 text-base dark:text-gray-300">
                {formatStartDate(course.startDate)}
              </span>
            </p>
            <div className="grid grid-flow-col auto-cols-max items-center gap-2">
              <span className="font-semibold ml-2 px-3 py-0.5 bg-red-100 text-red-800 rounded-full">Finaliza</span>
              <div className="text-center">
                <p className={'text-base dark:text-gray-300'}>Un día antes de la prueba</p>
                <p
                  className="text-base text-gray-600 dark:text-gray-400 font-semibold">({formatEndDate(course.endDate)})</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-500"/>
            <div>
              <p className="font-semibold text-xl flex items-center text-blue-900 dark:text-gray-300">Costo total: <span
                className={'text-4xl pl-2 text-black dark:text-blue-500'}> ${course.cost}</span></p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold flex items-center mb-2 text-blue-900 dark:text-gray-300">
              <Award className="w-5 h-5 mr-2 text-blue-500"/>
              Beneficios
            </h4>
            <ul className="space-y-1 pl-7">
              {course.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold flex items-center mb-2 text-blue-900 dark:text-gray-300">
              <UserPen className="w-5 h-5 mr-2 text-blue-500"/>
              Horarios Presenciales
            </h4>
            <ul className="space-y-1 pl-7">
              {course.inPersonSchedules.map((inPersonSchedule, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {inPersonSchedule}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold flex items-center mb-2 text-blue-900 dark:text-gray-300">
              <MonitorCheck className="w-5 h-5 mr-2 text-blue-500"/>
              Horarios Virtuales
            </h4>
            <ul className="space-y-1 pl-7">
              {course.virtualSchedules.map((virtualSchedule, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {virtualSchedule}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold flex items-center mb-2 text-blue-900 dark:text-gray-300">
              <HandCoins className="w-5 h-5 mr-2 text-blue-500"/>
              Opciones de Pago
            </h4>
            <ul className="space-y-1 pl-7">
              {course.paymentOptions.map((option, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold flex items-center mb-2 text-blue-900 dark:text-gray-300">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500"/>
              Temario
            </h4>
            <ul className="space-y-1 pl-7">
              {course.syllabus.map((item, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
        <p className="select-none text-lg font-semibold text-blue-600 dark:text-blue-400">
          ¡Inscríbete ya! Cupos limitados
        </p>
        <a href={`https://wa.me/593${course.phone.substring(1)}?text=Hola,%20quiero%20más%20información`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          <PhoneCall className="w-5 h-5 mr-2"/>
          {course.phone}
        </a>
      </div>
    </motion.div>
  )
}

export default CourseOffer
