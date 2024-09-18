import React from 'react';
import Image from 'next/image';

interface FinalScoreProps {
  score: number;
  total: number;
  onNewAttempt: () => void;
  onReviewAttempt: () => void;
  onExit: () => void;
}

const FinalScore: React.FC<FinalScoreProps> = ({ score, total, onNewAttempt, onReviewAttempt, onExit }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[700px] bg-white dark:bg-gray-900">
      <div className="bg-gray-200 shadow-lg rounded-lg p-10 flex flex-col items-center bg-gradient-to-b dark:from-gray-700 dark:to-gray-800 transition-colors duration-300">
        {/* Logo */}
        <div className="relative h-24 w-48 mb-4">
          <Image
            src="/images/image-1.png"
            alt="CENFI Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* Puntaje Final */}
        <h1 className="text-2xl font-semibold mb-4 text-center dark:text-gray-300">
          Tu puntaje final es de {score}/{total}
        </h1>

        <hr className="my-4 w-full" />

        {/* Botones de Acción */}
        <div className="flex space-x-4 justify-center mt-6">
          <button
            onClick={onNewAttempt}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg dark:text-gray-800"
          >
            Nuevo Intento
          </button>

          <button
            onClick={onReviewAttempt}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg dark:text-gray-800"
          >
            Revisar Intento
          </button>

          <button
            onClick={onExit}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg dark:text-gray-800"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
