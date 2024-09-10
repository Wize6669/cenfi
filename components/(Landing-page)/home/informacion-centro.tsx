'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award } from 'lucide-react'

const infoCards = [
  {
    title: "Experiencia y Metodología",
    icon: BookOpen,
    description: "Disponemos de un equipo de trabajo con profesionales de cuarto nivel, con más de 10 años de experiencia en la preparación y asesoría académica, que cuentan con un enfoque integral que combina teoría, práctica y desarrollo de habilidades.",
  },
  {
    title: "Profesores Calificados",
    icon: Users,
    description: "Cada profesional es especialista en áreas relacionadas con la parte psicotécnica que incluye el dominio de Razonamientos y en conocimientos específicos, garantizando una enseñanza de alta calidad.",
  },
  {
    title: "Logros Alcanzados",
    icon: Award,
    description: "Obtención de excelentes resultados de ingreso a universidades locales y a nivel nacional. Contamos con alumnos vinculados al programa GAR (Grupo de Alto Rendimiento).",
  },
]

export default function InformacionCentro() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-60">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-indigo-800 dark:text-blue-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Información del Centro
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card className="h-full bg-white dark:border-none dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-indigo-700 dark:to-blue-700 p-6">
                  <CardTitle className="flex items-center text-white text-xl justify-center">
                    <card.icon className="w-8 h-8 mr-3" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                  <motion.div
                    className="w-full h-1 bg-indigo-500 dark:bg-indigo-400 mt-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredIndex === index ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
