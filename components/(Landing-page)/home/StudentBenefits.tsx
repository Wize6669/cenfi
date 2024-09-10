'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Video, Compass, BookOpen, FileText, Monitor, PlayCircle, CheckCircle } from 'lucide-react';

interface Benefit {
  icon: React.ElementType;
  title: string;
}

const benefits: Benefit[] = [
  { icon: Users, title: "Clases presenciales" },
  { icon: Video, title: "Clases Virtuales" },
  { icon: Compass, title: "Orientación Vocacional" },
  { icon: BookOpen, title: "Capacitación Psicotécnica" },
  { icon: FileText, title: "Capacitación en conocimientos" },
  { icon: Monitor, title: "Material de trabajo Físico y Digital" },
  { icon: PlayCircle, title: "Práctica en Simuladores" },
  { icon: Video, title: "Clases grabadas" },
];

const StudentBenefits: React.FC = () => {
  return (
    <section className={'py-16 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900'}>
      <div className={'max-w-full mx-auto px-4 sm:px-6 lg:px-60'}>
        <motion.h2
          className={'text-3xl font-bold text-center mb-12 text-white dark:text-blue-300'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Beneficios para Estudiantes
        </motion.h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={'flex items-center space-x-4 bg-white bg-opacity-10 dark:bg-gray-700 dark:bg-opacity-20 rounded-lg p-4'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className={'bg-white dark:bg-gray-800 rounded-full p-2'}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <benefit.icon className={'w-6 h-6 text-blue-500 dark:text-blue-400'} />
              </motion.div>
              <span className={'text-lg font-medium text-white dark:text-gray-300'}>{benefit.title}</span>
              <CheckCircle className={'w-5 h-5 text-green-300 ml-auto'} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentBenefits;
