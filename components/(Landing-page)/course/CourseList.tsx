'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { config } from "@/config"
import { Course, PaginatedResponseCourse } from "@/interfaces/Course"
import axios from "axios"
import CourseOffer from './CourseOffer'
import CoursesFilter from './CoursesFilter'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('default')

  const fetchCourses = useCallback(async (page: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get<PaginatedResponseCourse>(`${HOST_BACK_END}/api/v1/courses`, {
        params: {
          page: page,
          count: 50
        }
      })

      if (page === 1) {
        setCourses(response.data.data)
        setFilteredCourses(response.data.data)
      } else {
        setCourses(prevCourses => {
          const newCourses = [...prevCourses, ...response.data.data]
          setFilteredCourses(newCourses)
          return newCourses
        })
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

  useEffect(() => {
    let sorted = [...courses].filter(course =>
        course.university.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortOption === 'asc') {
      sorted.sort((a, b) => a.cost - b.cost)
    } else if (sortOption === 'desc') {
      sorted.sort((a, b) => b.cost - a.cost)
    }

    setFilteredCourses(sorted)
  }, [courses, searchTerm, sortOption])

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  const handleSortChange = (sort: string) => {
    setSortOption(sort)
  }

  const loadMoreCourses = () => {
    if (currentPage < totalPages) {
      fetchCourses(currentPage + 1)
    }
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
      <div className="container mx-auto px-4 md:py-8 py-4">
        <motion.h1
          className="pb-0 md:pb-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-center mb-4 text-blue-800 dark:text-blue-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >Nuestros Cursos
        </motion.h1>
        <CoursesFilter
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            totalCourses={filteredCourses.length}
        />
        {isLoading && currentPage === 1 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        ) : filteredCourses.length > 0 ? (
            <div className="space-y-6">
              {filteredCourses.map((course, index) => (
                  <CourseOffer key={course.id} course={course} index={index} />
              ))}
            </div>
        ) : (
            <div className="text-sm md:text-sm lg:text-base text-center text-gray-500">No hay cursos disponibles que coincidan con los criterios de búsqueda</div>
        )}
        {!isLoading && currentPage < totalPages && filteredCourses.length > 0 && (
            <div className="text-center mt-8">
              <button
                  onClick={loadMoreCourses}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : null}
                Cargar más cursos
              </button>
            </div>
        )}
      </div>
  )
}

export default CourseList
