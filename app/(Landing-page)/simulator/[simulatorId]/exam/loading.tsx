import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Mensaje de carga */}
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    </div>
  );
}
