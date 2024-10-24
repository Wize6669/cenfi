import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicatorEdit: React.FC<LoadingIndicatorProps> = ({ message = 'Cargando información...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-4">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingIndicatorEdit;
