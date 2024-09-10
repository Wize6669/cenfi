import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { GraduationCap, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const cursos = [
  {
    title: "Curso universidades públicas",
    description: "Curso de preparación para la prueba de admisión de la UNL, UCE, EPN, UNACH, U Cuenca, UTMACH entre otras para cada período académico.",
    icon: GraduationCap
  },
  {
    title: "Curso de universidad privadas",
    description: "Cursos de preparación para la prueba de admisión UTPL, USFQ, PUCE, entre otras para cada período académico",
    icon: BookOpen
  },
  {
    title: "Cursos vacacionales",
    description: "Cursos de refuerzo académico en áreas como matemáticas, física, química, biología y ciencias sociales.",
    icon: Clock
  },
  {
    title: "Talleres estratégicos",
    description: "Cursos para desarrollo de pruebas tipo de universidades públicas y privadas",
    icon: Lightbulb
  }
];

const OurCourses = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className={'py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900'}>
      <div className={'container mx-auto lg:px-8 md:px-8'}>
        <motion.h2
          className={'text-4xl font-bold text-blue-800 dark:text-blue-300 mb-12 text-center'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nuestros Cursos
        </motion.h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
          {cursos.map((curso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card className={'group hover:shadow-lg transition-shadow duration-300 min-h-[327px] dark:bg-gray-800 dark:border-none'}>
                <CardHeader className={'text-center'}>
                  <div className={'mx-auto bg-blue-100 rounded-full p-3 mb-4 group-hover:bg-blue-200 transition-colors duration-300 dark:bg-gray-700 dark:group-hover:bg-gray-600'}>
                    <curso.icon className={'w-8 h-8 text-blue-600 dark:text-blue-200'} />
                  </div>
                  <CardTitle className={'text-xl font-semibold text-blue-700 group-hover:text-blue-800 transition-colors duration-300 dark:text-blue-300 dark:group-hover:text-gray-300'}>
                    {curso.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={'text-gray-600 text-center dark:text-gray-300'}>{curso.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCourses;
