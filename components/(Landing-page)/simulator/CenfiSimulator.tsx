import React from 'react';
import { FiClock, FiHelpCircle, FiPlay } from 'react-icons/fi';

const simuladores = [
  { nombre: "Simulador Universidad de Loja", duracion: 70, preguntas: 120 },
  { nombre: "Simulador EPN", duracion: 80, preguntas: 100 },
  { nombre: "Simulador Universidad Central del Ecuador", duracion: 70, preguntas: 120 },
  { nombre: "Simulador ESPE", duracion: 70, preguntas: 120 },
  { nombre: "Simulador Udla", duracion: 70, preguntas: 120 },
  { nombre: "Universidad Técnica Particular de Loja", duracion: 70, preguntas: 120 },
];

export default function CenfiSimulator() {
  return (
    <div className="container mx-auto px-4 py-8 dark:from-gray-800 dark:to-gray-900">
      <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Simuladores disponibles: {simuladores.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simuladores.map((simulador, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-blue-400">{simulador.nombre}</h2>
            <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400">
              <FiClock className="mr-2" />
              <p>{simulador.duracion} min</p>
            </div>
            <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400">
              <FiHelpCircle className="mr-2" />
              <p>{simulador.preguntas} preguntas</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center w-full">
              <FiPlay className="mr-2" />
              Iniciar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
