'use client'

import React, {useState, useEffect, useCallback} from 'react'
import { Calendar, Clock, DollarSign, BookOpen, Award, PhoneCall } from 'lucide-react'
import {config} from "@/config";
import { Course, PaginatedResponseCourse } from "@/interfaces/Course"
import axios from "axios";


const CourseOffer: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto mb-8">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-3xl font-bold">{course.name}</h2>
        <h3 className="text-xl mt-2">{course.university}</h3>
        <p className="text-lg mt-1">{course.schedule}</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold">Inicio: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'No especificado'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Finaliza: {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'No especificado'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-semibold">Costo total: ${course.cost}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{course.paymentOptions.join(', ')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500" /> Horarios disponibles</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 pl-5">
              {course.schedules.map((schedule, index) => (
                <li key={index}>{schedule}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Temario</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 pl-5">
              {course.syllabus.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center"><Award className="w-5 h-5 mr-2 text-blue-500" /> Beneficios</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 pl-5">
              {course.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">¡Inscríbete ya! Cupos limitados</p>
        <a href={`tel:${course.phone}`} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          <PhoneCall className="w-5 h-5 mr-2" />
          {course.phone}
        </a>
      </div>
    </div>
  )
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;

  const fetchCourses = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get<PaginatedResponseCourse>(`${HOST_BACK_END}/api/v1/course`, {
        params: {
          page: page,
          count: 50
        }
      });

      if (page === 1) {
        setCourses(response.data.data);
      } else {
        setCourses(prevCourses => [...prevCourses, ...response.data.data]);
      }

      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los cursos');
      setIsLoading(false);
      console.error('Error fetching courses:', err);
    }
  }, [HOST_BACK_END]);

  useEffect(() => {
    fetchCourses(1);
  }, [fetchCourses]);

  const loadMoreCourses = () => {
    if (currentPage < totalPages) {
      fetchCourses(currentPage + 1);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestros Cursos</h1>
      {courses.map(course => (
        <CourseOffer key={course.id} course={course} />
      ))}
      {isLoading && <div className="text-center">Cargando cursos...</div>}
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
      {!isLoading && currentPage === totalPages && (
        <div className="text-center mt-4 text-gray-600">No hay más cursos para cargar.</div>
      )}
    </div>
  );
}

export default CourseList;
