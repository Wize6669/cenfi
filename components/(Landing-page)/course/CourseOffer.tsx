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
      <div key={index} className="select-none bg-gradient-to-r from-blue-600 to-blue-400 py-3 px-4 md:py-4 md:px-5 text-white">
        <h2 className="flex justify-start items-center text-2xl sm:text-2xl md:text-2xl lg:text-3xl dark:text-gray-200 font-bold mb-2">{course.name}</h2>
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold dark:text-gray-200">{course.university}</h3>
          <p className="text-xs md:text-sm lg:text-base bg-blue-700 px-4 py-2 rounded-full mt-4 md:mt-0 dark:text-gray-200">{course.schedule}</p>
        </div>
      </div>
      <div className="select-none px-4 py-3 md:px-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-blue-500"/>
              <h4 className="text-sm md:text-base lg:text-base font-semibold text-blue-900 dark:text-blue-300">Cronograma</h4>
            </div>
            <p className="mb-2">
              <span className="text-xs md:text-sm lg:text-base font-semibold text-blue-900 ml-2 px-3 bg-green-100 rounded-full">Inicio</span>
              <span className="text-sm md:text-sm lg:text-base ml-2 dark:text-gray-300">
                {formatStartDate(course.startDate)}
              </span>
            </p>
            <div className="grid grid-flow-col auto-cols-max items-center gap-2">
              <span className="text-xs md:text-sm lg:text-base font-semibold ml-2 px-3 bg-red-100 text-red-800 rounded-full">Finaliza</span>
              <div className="text-center">
                <p className={'text-sm md:text-sm lg:text-base dark:text-gray-300'}>Un día antes de la prueba</p>
                <p
                  className="text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-semibold">({formatEndDate(course.endDate)})</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-500"/>
            <div>
              <p className="font-semibold text-sm md:text-base lg:text-base flex items-center text-blue-900 dark:text-blue-300">Costo total: <span
                className={'text-lg md:text-xl lg:text-3xl text-blue-950 dark:text-blue-500 ml-2 pr-2 pl-2 bg-blue-100 rounded-xl'}> ${course.cost}</span></p>
            </div>
          </div>
          <div>
            <h4 className="text-sm md:text-base lg:text-base font-semibold flex items-center mb-2 text-blue-900 dark:text-blue-300">
              <Award className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500"/>
              Beneficios
            </h4>
            <ul className="space-y-1 pl-7">
              {course.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm md:text-base lg:text-base font-semibold flex items-center mb-2 text-blue-900 dark:text-blue-300">
              <UserPen className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500"/>
              Horarios Presenciales
            </h4>
            <ul className="space-y-1 pl-7">
              {course.inPersonSchedules.map((inPersonSchedule, index) => (
                <li key={index} className="flex text-sm md:text-sm lg:text-base items-center text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                  {inPersonSchedule}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm md:text-base lg:text-base font-semibold flex items-center mb-2 text-blue-900 dark:text-blue-300">
              <MonitorCheck className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500"/>
              Horarios Virtuales
            </h4>
            <ul className="space-y-1 pl-7">
              {course.virtualSchedules.map((virtualSchedule, index) => (
                <li key={index} className="flex items-center text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                  {virtualSchedule}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm md:text-base lg:text-base font-semibold flex items-center mb-2 text-blue-900 dark:text-blue-300">
              <HandCoins className="w-5 h-5 mr-2 text-blue-500"/>
              Opciones de Pago
            </h4>
            <ul className="space-y-1 pl-7">
              {course.paymentOptions.map((option, index) => (
                <li key={index} className="flex items-center text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm md:text-base lg:text-base font-semibold flex items-center mb-2 text-blue-900 dark:text-blue-300">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500"/>
              Temario
            </h4>
            <ul className="space-y-1 pl-7">
              {course.syllabus.map((item, index) => (
                <li key={index} className="flex items-center text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 dark:border-none p-4 flex justify-between items-center">
        <p className="select-none text-base md:text-base lg:text-lg font-semibold text-blue-600 dark:text-blue-400 pr-5 md:pr-0">
          ¡Inscríbete ya! Cupos limitados
        </p>
        <a href={`https://wa.me/593${course.phone.substring(1)}?text=Hola,%20quiero%20más%20información`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center bg-blue-600 text-white text-sm md:text-sm lg:text-base px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 dark:text-gray-200">
          <PhoneCall className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-2"/>
          {course.phone}
        </a>
      </div>
    </motion.div>
  )
}

export default CourseOffer
