"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Users, BookOpenCheck, School, CheckCircle, Award, ChevronLeft, ChevronRight } from "lucide-react"

const admissionSteps = [
  { icon: Flag, title: "Registro Nacional", description: "Paso obligatorio para los bachilleres y permite a las instituciones de educación superior realizar sus procesos de admisión" },
  { icon: Users, title: "Inscripción Postulación", description: "Inscripciones en centros de educación superior pública o privada del país" },
  { icon: BookOpenCheck, title: "Evaluación Capacidades", description: "Mide tu nivel en distintos ámbitos educativos" },
  { icon: School, title: "Postulaciones", description: "Una vez rendida la prueba podrás decidir en qué universidad o institución de educación superior estudiar" },
  { icon: CheckCircle, title: "Asignación Aceptación de cupo", description: "Cada institución superior organizará el proceso de admisión - mantente atento a la información oficial dada por la institución que elegiste" },
  { icon: Award, title: "Matrículas", description: "Cada institución de educación superior llevará a cabo su proceso de matriculación" }
]

export default function ProcesoAdmision() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => setCurrentStep((prev) => (prev + 1) % admissionSteps.length)
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + admissionSteps.length) % admissionSteps.length)

  return (
    <section className={'py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900'}>
      <div className={'max-w-full mx-auto px-4 sm:px-6 lg:px-60'}>
        <motion.h2
          className={'text-3xl font-bold text-center mb-12 text-blue-800 dark:text-blue-300'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Proceso de Admisión
        </motion.h2>
        <div className={'relative'}>
          <div className={'relative flex justify-between items-center lg:mb-12 md:mx-10'}>
            {admissionSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center cursor-pointer z-10 ${
                  index === currentStep ? 'scale-110' : 'scale-100 opacity-50'
                }`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index === currentStep ? 'bg-blue-500 text-white dark:bg-blue-400' : 'bg-white text-blue-500 dark:bg-gray-700 dark:text-gray-200'
                } border-2 border-blue-500 dark:border-gray-500`}>
                  {<step.icon className={'w-6 h-6'} />}
                </div>
                <span className={'mt-2 text-xs font-medium text-blue-800 dark:text-gray-300 hidden lg:block'}>{step.title}</span>
              </motion.div>
            ))}
          </div>
          <Card className={'mt-8 dark:bg-gray-800 dark:border-none'}>
            <CardContent className={'p-6'}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className={'text-xl font-bold mb-2 text-blue-700 dark:text-blue-300'}>{admissionSteps[currentStep].title}</h3>
                <p className={'text-gray-600 dark:text-gray-400'}>{admissionSteps[currentStep].description}</p>
              </motion.div>
            </CardContent>
          </Card>
          <div className={'flex justify-between mt-8'}>
            <Button onClick={prevStep} variant={'outline'} className={'flex items-center dark:border-gray-600 dark:text-gray-300 dark:bg-gray-600'}>
              <ChevronLeft className={'mr-2 h-4 w-4'} /> Anterior
            </Button>
            <Button onClick={nextStep} className={'flex items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'}>
              Siguiente <ChevronRight className={'ml-2 h-4 w-4 '} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
