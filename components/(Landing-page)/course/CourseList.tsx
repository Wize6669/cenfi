'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { config } from "@/config"
import { Course, PaginatedResponseCourse } from "@/interfaces/Course"
import axios from "axios"
import CourseOffer from './CourseOffer'

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env

  const fetchCourses = useCallback(async (page: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get<PaginatedResponseCourse>(`${HOST_BACK_END}/api/v1/course`, {
        params: {
          page: page,
          count: 50
        }
      })

      if (page === 1) {
        setCourses(response.data.data)
      } else {
        setCourses(prevCourses => [...prevCourses, ...response.data.data])
      }

      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setIsLoading(false)
    } catch (err) {
      setError('Error al cargar los cursos')
      setIsLoading(false)
      console.error('Error fetching courses:', err)
    }
  }, [HOST_BACK_END])

  useEffect(() => {
    fetchCourses(1)
  }, [fetchCourses])

  const loadMoreCourses = () => {
    if (currentPage < totalPages) {
      fetchCourses(currentPage + 1)
    }
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800 dark:text-blue-500">Nuestros Cursos</h1>
      {isLoading ? (
        <div className="text-center">Cargando cursos...</div>
      ) : courses.length > 0 ? (
        courses.map((course, index) => (
          <CourseOffer key={course.id} course={course} index={index}/>
        ))
      ) : (
        <div className="text-center text-gray-500">No hay cursos disponibles</div>
      )}
      {!isLoading && currentPage < totalPages && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreCourses}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cargar más cursos
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseList
