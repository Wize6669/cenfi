'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const simuladores = [
  { nombre: 'Simulador Universidad de Loja', duracion: 70, preguntas: 120 },
  { nombre: 'Simulador EPN', duracion: 80, preguntas: 100 },
  { nombre: 'Simulador Universidad Central del Ecuador', duracion: 70, preguntas: 120 },
  { nombre: 'Simulador ESPE', duracion: 70, preguntas: 120 },
  { nombre: 'Simulador Udla', duracion: 70, preguntas: 120 },
  { nombre: 'Universidad Técnica Particular de Loja', duracion: 70, preguntas: 120 },
];

interface SimuladorProps {
  nombre: string;
  duracion: number;
  preguntas: number;
}

const SimuladorCard: React.FC<SimuladorProps> = ({ nombre, duracion, preguntas }) => {
  const router = useRouter();

  const handleStartSimulator = () => {
    router.push('/simulator/start-simulator');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-600 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full'}
    >
      <div className={'p-6 flex flex-col flex-grow'}>
        <h2 className={'text-xl font-bold text-gray-800 dark:text-blue-300 mb-4 flex-grow'}>
          {nombre}
        </h2>
        <div className={'flex justify-between items-center mt-auto'}>
          <div className={'space-y-2'}>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <Clock className={'w-4 h-4 mr-2 text-cyan-950'} />
              <span className={'text-sm'}>
                {duracion} min
              </span>
            </div>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <HelpCircle className={'w-4 h-4 mr-2 text-amber-600'} />
              <span className={'text-sm'}>
                {preguntas} preguntas
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300'}
            onClick={handleStartSimulator}
          >
            Iniciar
            <Play className={'w-4 h-4 ml-2'} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CenfiSimulator() {
  return (
    <div className={'container mx-auto px-4 py-8'}>
      <p className={'text-xl font-bold mb-6 text-blue-900 dark:text-blue-500'}>
        Simuladores disponibles: {simuladores.length}
      </p>
      <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {simuladores.map((simulador, index) => (
          <SimuladorCard key={index} {...simulador} />
        ))}
      </div>
    </div>
  );
}
